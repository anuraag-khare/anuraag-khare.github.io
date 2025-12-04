---
layout: post
title: "Building RAG Systems: Lessons Learned from Production"
date: 2024-12-03
description: "Practical insights from building Retrieval-Augmented Generation systems in production, covering architecture decisions, embedding strategies, and common pitfalls."
categories: [GenAI]
tags: [RAG, LLM, Vector Databases, Python, LangChain]
reading_time: 8
---

Retrieval-Augmented Generation (RAG) has become the go-to pattern for building LLM applications that need to work with custom data. After implementing RAG systems in production, here are the lessons I've learned—the hard way.

## What is RAG, Really?

At its core, RAG is elegantly simple: instead of fine-tuning an LLM on your data (expensive and complex), you retrieve relevant context at query time and inject it into the prompt.

```
User Query → Retrieve Relevant Docs → Augment Prompt → Generate Response
```

But as with most things in software, the devil is in the details.

## Lesson 1: Chunking Strategy Matters More Than You Think

Your chunking strategy can make or break retrieval quality. Here's what I've learned:

### Don't Just Split by Token Count

```python
# ❌ Naive approach
chunks = text_splitter.split_text(document, chunk_size=500)

# ✅ Better: Use semantic boundaries
chunks = recursive_splitter.split_text(
    document,
    separators=["\n\n", "\n", ". ", " "],
    chunk_size=500,
    chunk_overlap=50
)
```

### Consider Document Structure

For structured documents (PDFs, markdown), preserve hierarchy:

```python
def smart_chunk(document):
    # Preserve headers and their content together
    sections = extract_sections(document)
    chunks = []
    for section in sections:
        if len(section) > MAX_CHUNK_SIZE:
            chunks.extend(split_preserving_context(section))
        else:
            chunks.append(section)
    return chunks
```

## Lesson 2: Embedding Selection is Critical

Not all embeddings are created equal. Here's my decision framework:

| Use Case | Recommended Model | Why |
|----------|------------------|-----|
| General text | `text-embedding-3-small` | Good balance of cost/quality |
| Technical docs | `text-embedding-3-large` | Better semantic understanding |
| Privacy-sensitive | `all-MiniLM-L6-v2` | Runs locally, no API calls |

### The Privacy Trade-off

For sensitive data, local embeddings are non-negotiable:

```python
from sentence_transformers import SentenceTransformer

# Runs entirely on your infrastructure
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(chunks)
```

## Lesson 3: Hybrid Search Outperforms Pure Vector Search

Vector similarity isn't always enough. Combining it with keyword search (BM25) significantly improves results:

```python
from langchain.retrievers import EnsembleRetriever

vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
bm25_retriever = BM25Retriever.from_documents(docs, k=5)

# Combine with weighted fusion
ensemble = EnsembleRetriever(
    retrievers=[vector_retriever, bm25_retriever],
    weights=[0.6, 0.4]
)
```

This is especially important for:
- Technical documentation with specific terminology
- Code snippets and error messages
- Queries with exact phrases

## Lesson 4: Context Window Management

Just because you can stuff 100k tokens doesn't mean you should.

### The "Lost in the Middle" Problem

LLMs struggle with information in the middle of long contexts. Structure your retrieved content:

```python
def format_context(retrieved_docs):
    # Most relevant at start and end
    sorted_docs = sorted(retrieved_docs, key=lambda x: x.score)
    
    top_half = sorted_docs[:len(sorted_docs)//2]
    bottom_half = sorted_docs[len(sorted_docs)//2:]
    
    # Interleave for better attention distribution
    return interleave(top_half, reversed(bottom_half))
```

## Lesson 5: Evaluation is Hard But Essential

You can't improve what you can't measure. Here's a practical evaluation approach:

```python
def evaluate_rag_response(query, response, ground_truth):
    metrics = {
        "relevance": compute_relevance(response, ground_truth),
        "faithfulness": check_hallucination(response, retrieved_context),
        "completeness": check_coverage(response, ground_truth),
        "latency_ms": measure_latency()
    }
    return metrics
```

### Key Metrics to Track

1. **Retrieval Precision**: Are we fetching relevant documents?
2. **Answer Faithfulness**: Is the answer grounded in retrieved context?
3. **End-to-end Latency**: User experience matters
4. **Cost per Query**: Especially with paid embeddings/LLMs

## Common Pitfalls to Avoid

### 1. Ignoring Metadata
Always preserve and leverage document metadata:

```python
chunk = Document(
    page_content=text,
    metadata={
        "source": filename,
        "page": page_num,
        "section": section_title,
        "date": doc_date
    }
)
```

### 2. Not Handling Edge Cases
What happens when retrieval returns nothing relevant?

```python
if max(doc.score for doc in retrieved) < RELEVANCE_THRESHOLD:
    return "I don't have enough information to answer this question accurately."
```

### 3. Over-engineering the First Version
Start simple, measure, iterate. Don't build a complex multi-stage retrieval pipeline before proving the basic approach works.

## Wrapping Up

Building RAG systems is an iterative process. Start with the basics, measure everything, and optimize based on real user feedback. The perfect architecture is the one that solves your specific problem—not the most sophisticated one.

In future posts, I'll dive deeper into specific topics like multi-modal RAG, agent-based retrieval, and production deployment strategies.

---

*Have questions or want to share your RAG experiences? Reach out on [LinkedIn](https://www.linkedin.com/in/anuraagkhare/) or [GitHub](https://github.com/anuraag-khare)!*

