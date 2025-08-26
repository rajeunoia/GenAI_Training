// Quiz questions extracted from the evaluation HTML files
// Each week has 20 questions, but only 10 random ones are shown per attempt

const quizQuestions = {
  1: [ // Week 1 - GenAI Fundamentals & Prompt Engineering
    {
      q: "What is the main advantage of using prompt engineering with LLMs like ChatGPT?",
      options: [
        "It allows you to control the model's output more precisely",
        "It makes the model run faster",
        "It reduces the size of the model",
        "It eliminates the need for training data"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a best practice in prompt engineering?",
      options: [
        "Use vague instructions",
        "Be explicit and provide examples",
        "Avoid specifying output format",
        "Always use the same prompt for all tasks"
      ],
      answer: 1
    },
    {
      q: "What is a Large Language Model (LLM)?",
      options: [
        "A model trained to generate images",
        "A model trained on large amounts of text to generate and understand language",
        "A database management system",
        "A tool for compiling code"
      ],
      answer: 1
    },
    {
      q: "Which of the following is a use case for LangChain?",
      options: [
        "Building chains of LLM calls for complex workflows",
        "Training neural networks from scratch",
        "Managing cloud infrastructure",
        "Creating web page layouts"
      ],
      answer: 0
    },
    {
      q: "What is the purpose of function calling in LLMs (as seen in ChatGPT Prompt Engineering for Developers)?",
      options: [
        "To allow the LLM to execute Python code directly",
        "To enable the LLM to call external tools or APIs based on user input",
        "To speed up model inference",
        "To reduce memory usage"
      ],
      answer: 1
    },
    {
      q: "What is the main benefit of using Ollama as shown in the 'Learn Ollama in 15 Minutes' video?",
      options: [
        "It allows you to run LLMs locally on your machine",
        "It is a cloud-based LLM service",
        "It is used for image generation",
        "It is a code editor"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a key feature of GitHub Copilot?",
      options: [
        "Automated code suggestions and completions in your IDE",
        "Database management",
        "Model training",
        "Web hosting"
      ],
      answer: 0
    },
    {
      q: "In LangChain, what is a 'PromptTemplate'?",
      options: [
        "A tool for visualizing data",
        "A way to structure prompts for LLMs with variables",
        "A database schema",
        "A code linter"
      ],
      answer: 1
    },
    {
      q: "According to the 'Generative AI with LLMs' course, what is a key step in the generative AI project lifecycle?",
      options: [
        "Prompt engineering and evaluation",
        "Ignoring user feedback",
        "Only using pre-trained models without modification",
        "Focusing only on model size"
      ],
      answer: 0
    },
    {
      q: "What is a good practice when evaluating the output of an LLM?",
      options: [
        "Check for correctness and relevance to the prompt",
        "Assume all outputs are correct",
        "Ignore the output format",
        "Never use examples in prompts"
      ],
      answer: 0
    },
    {
      q: "What is a key difference between generative AI and traditional AI?",
      options: [
        "Generative AI creates new content, traditional AI only classifies or predicts",
        "Traditional AI is always more accurate",
        "Generative AI cannot use neural networks",
        "Traditional AI is only used for games"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a common application of generative AI?",
      options: [
        "Text summarization",
        "Image generation",
        "Code generation",
        "All of the above"
      ],
      answer: 3
    },
    {
      q: "What is the main purpose of pre-training in LLMs?",
      options: [
        "To learn general language patterns from large text corpora",
        "To fine-tune on specific tasks",
        "To reduce model size",
        "To evaluate model outputs"
      ],
      answer: 0
    },
    {
      q: "Which of the following best describes 'zero-shot' learning in LLMs?",
      options: [
        "The model can perform a task without any task-specific examples",
        "The model requires thousands of examples",
        "The model only works for image data",
        "The model is not pre-trained"
      ],
      answer: 0
    },
    {
      q: "Why is evaluation important in the generative AI project lifecycle?",
      options: [
        "To ensure outputs are relevant, accurate, and safe",
        "To make the model run faster",
        "To reduce the number of parameters",
        "To avoid using prompts"
      ],
      answer: 0
    },
    {
      q: "What is a 'prompt' in the context of LLMs?",
      options: [
        "A set of training data",
        "A piece of text or instruction given to the model to generate a response",
        "A type of neural network",
        "A data labeling tool"
      ],
      answer: 1
    },
    {
      q: "Which of the following is a limitation of LLMs?",
      options: [
        "They may generate plausible but incorrect information",
        "They can only process images",
        "They do not require any data to train",
        "They always cite their sources"
      ],
      answer: 0
    },
    {
      q: "What is 'fine-tuning' in the context of LLMs?",
      options: [
        "Training a model from scratch",
        "Adapting a pre-trained model to a specific task or dataset",
        "Evaluating model outputs",
        "Compressing the model"
      ],
      answer: 1
    },
    {
      q: "Which of the following is a recommended way to improve LLM output quality?",
      options: [
        "Provide clear instructions and examples in the prompt",
        "Use random prompts",
        "Avoid specifying output format",
        "Only use short prompts"
      ],
      answer: 0
    },
    {
      q: "What is 'hallucination' in LLMs?",
      options: [
        "When the model generates information that is not factual or grounded in data",
        "When the model runs too fast",
        "When the model is compressed",
        "When the model is fine-tuned"
      ],
      answer: 0
    }
  ],

  2: [ // Week 2 - Vector Databases & RAG
    {
      q: "What is a vector database primarily used for in GenAI applications?",
      options: [
        "Storing tabular data",
        "Storing and searching high-dimensional embeddings",
        "Managing user authentication",
        "Serving web pages"
      ],
      answer: 1
    },
    {
      q: "What does RAG stand for in the context of LLM applications?",
      options: [
        "Retrieval-Augmented Generation",
        "Random Access Generation",
        "Rapid AI Generation",
        "Recursive Agent Generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a key benefit of using RAG pipelines?",
      options: [
        "They allow LLMs to access up-to-date or proprietary information",
        "They reduce the size of the LLM",
        "They eliminate the need for prompts",
        "They are only used for image generation"
      ],
      answer: 0
    },
    {
      q: "What is ChromaDB?",
      options: [
        "A vector database for storing and searching embeddings",
        "A cloud hosting provider",
        "A Python linter",
        "A web server"
      ],
      answer: 0
    },
    {
      q: "Which step is NOT part of a typical RAG pipeline?",
      options: [
        "Embedding documents",
        "Similarity search",
        "LLM generation",
        "Model training from scratch"
      ],
      answer: 3
    },
    {
      q: "What is an embedding in the context of vector databases?",
      options: [
        "A compressed image",
        "A high-dimensional numeric representation of data",
        "A database schema",
        "A type of neural network"
      ],
      answer: 1
    },
    {
      q: "Which library is commonly used for building RAG pipelines in Python?",
      options: [
        "LangChain",
        "TensorFlow",
        "Flask",
        "Pandas"
      ],
      answer: 0
    },
    {
      q: "What is the main function of a retriever in a RAG pipeline?",
      options: [
        "To generate text",
        "To fetch relevant documents or chunks from a database",
        "To train the LLM",
        "To visualize embeddings"
      ],
      answer: 1
    },
    {
      q: "Which of the following is a common use case for ChromaDB?",
      options: [
        "Similarity search over document embeddings",
        "Web hosting",
        "Image classification",
        "Data labeling"
      ],
      answer: 0
    },
    {
      q: "What is the purpose of reranking in a RAG pipeline?",
      options: [
        "To sort retrieved documents by relevance",
        "To train the retriever",
        "To compress embeddings",
        "To generate prompts"
      ],
      answer: 0
    },
    {
      q: "Which component is responsible for generating the final answer in a RAG pipeline?",
      options: [
        "Retriever",
        "LLM (Large Language Model)",
        "Vector database",
        "Web server"
      ],
      answer: 1
    },
    {
      q: "What is a typical input to the embedding model in a RAG pipeline?",
      options: [
        "Raw text documents",
        "Database schemas",
        "Image files",
        "Compiled code"
      ],
      answer: 0
    },
    {
      q: "Why is it important to chunk documents before embedding them?",
      options: [
        "To reduce memory usage",
        "To improve retrieval granularity and relevance",
        "To speed up LLM inference",
        "To avoid using prompts"
      ],
      answer: 1
    },
    {
      q: "Which of the following is a limitation of RAG pipelines?",
      options: [
        "They may retrieve irrelevant or outdated information",
        "They cannot use LLMs",
        "They only work for images",
        "They do not use embeddings"
      ],
      answer: 0
    },
    {
      q: "What is the main advantage of using a vector database over a traditional SQL database for RAG?",
      options: [
        "Efficient similarity search in high-dimensional space",
        "Better support for tabular data",
        "Faster sorting of numbers",
        "Easier to use for transactions"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a best practice when building a RAG pipeline?",
      options: [
        "Regularly update the document embeddings",
        "Never update the database",
        "Use only one large chunk for all documents",
        "Avoid using retrievers"
      ],
      answer: 0
    },
    {
      q: "What is the role of the LLM in a RAG pipeline?",
      options: [
        "To generate answers using retrieved context",
        "To store embeddings",
        "To chunk documents",
        "To rerank search results"
      ],
      answer: 0
    },
    {
      q: "Which of the following is NOT a feature of ChromaDB?",
      options: [
        "Similarity search",
        "Document embedding",
        "Web page rendering",
        "Metadata filtering"
      ],
      answer: 2
    },
    {
      q: "What is a common metric used to measure similarity between embeddings?",
      options: [
        "Cosine similarity",
        "Mean squared error",
        "Accuracy",
        "Recall"
      ],
      answer: 0
    },
    {
      q: "Which of the following best describes the flow of a RAG pipeline?",
      options: [
        "User query → Retriever → LLM → Answer",
        "User query → LLM → Retriever → Answer",
        "User query → Vector DB → Answer",
        "User query → Embedding → Answer"
      ],
      answer: 0
    }
  ],

  3: [ // Week 3 - DB + RAG Tools
    {
      q: "What is the main purpose of using tools in LLM agents?",
      options: [
        "To extend the agent's capabilities beyond language generation",
        "To reduce the size of the model",
        "To speed up training",
        "To visualize data"
      ],
      answer: 0
    },
    {
      q: "Which database is commonly used for quick prototyping in GenAI projects?",
      options: [
        "SQLite",
        "MongoDB",
        "Oracle",
        "Cassandra"
      ],
      answer: 0
    },
    {
      q: "What is the role of the SQLDatabase chain in LangChain?",
      options: [
        "To enable LLMs to interact with SQL databases via natural language",
        "To train neural networks",
        "To store embeddings",
        "To generate prompts"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a benefit of combining DB and RAG tools in a single agent?",
      options: [
        "The agent can answer both structured (SQL) and unstructured (RAG) queries",
        "It reduces the need for prompts",
        "It eliminates the need for embeddings",
        "It only works for image data"
      ],
      answer: 0
    },
    {
      q: "What is a JSON-schema output in the context of LLM agents?",
      options: [
        "A structured format for the agent's response",
        "A database schema",
        "A type of neural network",
        "A prompt template"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a key challenge when allowing LLMs to execute SQL queries?",
      options: [
        "Ensuring queries are safe and do not modify or delete data unintentionally",
        "Speeding up query execution",
        "Reducing model size",
        "Improving image generation"
      ],
      answer: 0
    },
    {
      q: "What is the main function of a retriever in a DB+RAG agent?",
      options: [
        "To fetch relevant documents or data chunks",
        "To train the LLM",
        "To store SQL queries",
        "To visualize results"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a best practice for error handling in LLM agents?",
      options: [
        "Return clear error messages and handle exceptions gracefully",
        "Ignore all errors",
        "Only log errors to a file",
        "Never validate user input"
      ],
      answer: 0
    },
    {
      q: "What is a 'Data Q&A Agent' as described in Week 3?",
      options: [
        "An agent that routes questions to either a database or knowledge base depending on the query",
        "A tool for image classification",
        "A prompt engineering tool",
        "A web server"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a risk when allowing LLMs to generate SQL queries?",
      options: [
        "SQL injection or unsafe queries",
        "Faster query execution",
        "Improved image generation",
        "Better prompt engineering"
      ],
      answer: 0
    },
    {
      q: "What is the main advantage of using natural language to SQL tools?",
      options: [
        "They allow non-technical users to query databases",
        "They speed up model training",
        "They reduce database size",
        "They generate images"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a common output format for LLM agent responses?",
      options: [
        "Structured JSON",
        "Raw SQL only",
        "Binary data",
        "HTML only"
      ],
      answer: 0
    },
    {
      q: "What is a key benefit of using LangChain for database integration?",
      options: [
        "It provides abstractions for connecting LLMs to SQL databases",
        "It trains neural networks",
        "It visualizes embeddings",
        "It generates web pages"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a limitation of LLM-based SQL agents?",
      options: [
        "They may generate incorrect or inefficient queries",
        "They always require internet access",
        "They cannot use prompt templates",
        "They only work for images"
      ],
      answer: 0
    },
    {
      q: "What is the purpose of combining RAG and SQL tools in a single agent?",
      options: [
        "To answer both unstructured and structured data questions",
        "To speed up LLM inference",
        "To reduce database size",
        "To generate images"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a recommended way to validate SQL queries generated by LLMs?",
      options: [
        "Use parameterized queries and restrict permissions",
        "Allow all queries without validation",
        "Only use SELECT *",
        "Never log errors"
      ],
      answer: 0
    },
    {
      q: "What is a common use case for a DB+RAG agent?",
      options: [
        "Answering business questions that require both factual data and contextual information",
        "Generating images",
        "Training neural networks",
        "Serving web pages"
      ],
      answer: 0
    },
    {
      q: "Which of the following is NOT a feature of LangChain's SQLDatabase chain?",
      options: [
        "Natural language to SQL conversion",
        "Direct database schema modification",
        "Query execution",
        "Result formatting"
      ],
      answer: 1
    },
    {
      q: "What is a best practice for handling user input in LLM agents that generate SQL?",
      options: [
        "Sanitize and validate all user input",
        "Trust all input",
        "Ignore input format",
        "Only use input for prompts"
      ],
      answer: 0
    },
    {
      q: "Which of the following best describes the flow of a DB+RAG agent?",
      options: [
        "User query → Agent decides route (DB or RAG) → Executes tool → Returns answer",
        "User query → LLM → Retriever → Answer",
        "User query → Database → Answer",
        "User query → Vector DB → Answer"
      ],
      answer: 0
    }
  ],

  4: [ // Week 4 - Multi-Agent Systems & Evaluation
    {
      q: "What is an agent in the context of GenAI applications?",
      options: [
        "A system that can autonomously perform tasks using LLMs and tools",
        "A database schema",
        "A type of neural network",
        "A web server"
      ],
      answer: 0
    },
    {
      q: "What is a multi-agent system?",
      options: [
        "A system where multiple agents collaborate or interact to solve complex tasks",
        "A single LLM running alone",
        "A database with multiple tables",
        "A web application"
      ],
      answer: 0
    },
    {
      q: "Which framework is highlighted for building multi-agent systems in Week 4?",
      options: [
        "CrewAI",
        "TensorFlow",
        "Flask",
        "Pandas"
      ],
      answer: 0
    },
    {
      q: "What is a key benefit of using multiple tools in a LangChain agent?",
      options: [
        "The agent can solve a wider range of tasks by combining capabilities",
        "It reduces the need for prompts",
        "It eliminates the need for LLMs",
        "It only works for images"
      ],
      answer: 0
    },
    {
      q: "What is the purpose of evaluation in GenAI agent systems?",
      options: [
        "To measure performance, correctness, and reliability of agents",
        "To train neural networks",
        "To store embeddings",
        "To generate prompts"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a best practice for evaluating AI agents?",
      options: [
        "Use a golden set of test cases and measure relevant metrics",
        "Only test with random queries",
        "Never log errors",
        "Ignore user feedback"
      ],
      answer: 0
    },
    {
      q: "What is a 'Plan-&-Execute' agent pattern?",
      options: [
        "An agent that plans a sequence of tasks and executes them using tools",
        "A database schema",
        "A type of neural network",
        "A web server"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a key challenge in multi-agent systems?",
      options: [
        "Coordinating communication and task delegation between agents",
        "Reducing model size",
        "Improving image generation",
        "Speeding up database queries"
      ],
      answer: 0
    },
    {
      q: "What is a 'golden set' in the context of agent evaluation?",
      options: [
        "A curated set of test cases with known correct answers",
        "A set of random queries",
        "A database schema",
        "A prompt template"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a benefit of tracing in agent systems?",
      options: [
        "It helps debug, monitor, and improve agent behavior",
        "It trains neural networks",
        "It stores embeddings",
        "It generates prompts"
      ],
      answer: 0
    },
    {
      q: "What is a 'Research Agent' as described in Week 4?",
      options: [
        "An agent that plans tasks, calls tools, and returns a structured brief with references",
        "A tool for image classification",
        "A prompt engineering tool",
        "A web server"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a limitation of multi-agent systems?",
      options: [
        "Increased complexity in coordination and communication",
        "They always require internet access",
        "They cannot use prompt templates",
        "They only work for images"
      ],
      answer: 0
    },
    {
      q: "What is a key feature of CrewAI?",
      options: [
        "Orchestrating multiple agents and tools for collaborative tasks",
        "Training neural networks",
        "Visualizing embeddings",
        "Generating web pages"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a recommended way to evaluate agent performance?",
      options: [
        "Use metrics like accuracy, relevance, and response time",
        "Only use random prompts",
        "Ignore output format",
        "Never use examples"
      ],
      answer: 0
    },
    {
      q: "What is a limitation of using only a single tool in an agent?",
      options: [
        "Limited problem-solving capability compared to multi-tool agents",
        "Faster execution",
        "Better image generation",
        "Improved prompt engineering"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a best practice for agent communication?",
      options: [
        "Define clear protocols and message formats",
        "Allow all agents to communicate freely without structure",
        "Never log communication",
        "Ignore errors"
      ],
      answer: 0
    },
    {
      q: "What is the main advantage of using evaluation frameworks for agents?",
      options: [
        "Standardized and repeatable assessment of agent performance",
        "Faster model training",
        "Reduced database size",
        "Improved image generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following is NOT a feature of CrewAI?",
      options: [
        "Multi-agent orchestration",
        "Web page rendering",
        "Tool integration",
        "Task delegation"
      ],
      answer: 1
    },
    {
      q: "What is a best practice for handling errors in agent systems?",
      options: [
        "Log errors and provide informative feedback",
        "Ignore all errors",
        "Only log errors to a file",
        "Never validate user input"
      ],
      answer: 0
    },
    {
      q: "Which of the following best describes the flow of a multi-agent system?",
      options: [
        "User query → Coordinator agent → Task delegation to sub-agents → Aggregation of results → Final answer",
        "User query → LLM → Retriever → Answer",
        "User query → Database → Answer",
        "User query → Vector DB → Answer"
      ],
      answer: 0
    }
  ],

  5: [ // Week 5 - MCP & Agent Communication Protocols
    {
      q: "What does MCP stand for in the context of GenAI protocols?",
      options: [
        "Model Context Protocol",
        "Multi-agent Communication Protocol",
        "Machine Control Program",
        "Model Communication Platform"
      ],
      answer: 0
    },
    {
      q: "What is the main purpose of the MCP protocol?",
      options: [
        "To enable rich context sharing between agents and tools",
        "To train neural networks",
        "To store embeddings",
        "To generate prompts"
      ],
      answer: 0
    },
    {
      q: "What does ACP (A2A) stand for?",
      options: [
        "Agent Communication Protocol (Agent-to-Agent)",
        "Automated Control Platform",
        "Advanced Communication Protocol",
        "Agent Context Processor"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a key feature of the MCP protocol?",
      options: [
        "Standardized message formats for agent-tool communication",
        "Image generation",
        "Database schema management",
        "Web page rendering"
      ],
      answer: 0
    },
    {
      q: "What is a local MCP server used for?",
      options: [
        "Exposing tools (like DB or KB) to MCP-capable clients",
        "Training neural networks",
        "Storing embeddings",
        "Generating prompts"
      ],
      answer: 0
    },
    {
      q: "What is the main benefit of using ACP/A2A protocols?",
      options: [
        "Enabling structured agent-to-agent communication and task handoff",
        "Speeding up model training",
        "Reducing database size",
        "Improving image generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a best practice for implementing agent communication protocols?",
      options: [
        "Define clear message schemas and handle errors gracefully",
        "Ignore all errors",
        "Never log communication",
        "Allow all agents to communicate freely without structure"
      ],
      answer: 0
    },
    {
      q: "What is a key challenge in agent-to-agent communication?",
      options: [
        "Ensuring reliable message delivery and task coordination",
        "Reducing model size",
        "Improving image generation",
        "Speeding up database queries"
      ],
      answer: 0
    },
    {
      q: "What is a typical use case for a local MCP server?",
      options: [
        "Serving as an interface between agents and local tools/databases",
        "Training neural networks",
        "Storing embeddings",
        "Generating prompts"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a benefit of using standardized protocols in multi-agent systems?",
      options: [
        "Interoperability and easier integration of diverse agents and tools",
        "Faster model training",
        "Reduced database size",
        "Improved image generation"
      ],
      answer: 0
    },
    {
      q: "What is a message schema in the context of agent communication?",
      options: [
        "A structured format defining the content and structure of messages",
        "A database schema",
        "A type of neural network",
        "A prompt template"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a limitation of agent-to-agent protocols?",
      options: [
        "Increased complexity in coordination and error handling",
        "They always require internet access",
        "They cannot use prompt templates",
        "They only work for images"
      ],
      answer: 0
    },
    {
      q: "What is a best practice for testing MCP/ACP implementations?",
      options: [
        "Use a set of test cases with known expected outcomes",
        "Only test with random queries",
        "Never log errors",
        "Ignore user feedback"
      ],
      answer: 0
    },
    {
      q: "What is a 'handoff' in the context of ACP/A2A?",
      options: [
        "Transferring a task or message from one agent to another",
        "Training a neural network",
        "Storing embeddings",
        "Generating prompts"
      ],
      answer: 0
    },
    {
      q: "Which of the following is NOT a feature of the MCP protocol?",
      options: [
        "Standardized message formats",
        "Web page rendering",
        "Context sharing",
        "Tool exposure"
      ],
      answer: 1
    },
    {
      q: "What is a common metric for evaluating agent communication?",
      options: [
        "Message delivery success rate",
        "Model size",
        "Image quality",
        "Database speed"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a recommended way to handle errors in agent protocols?",
      options: [
        "Log errors and provide informative feedback",
        "Ignore all errors",
        "Only log errors to a file",
        "Never validate user input"
      ],
      answer: 0
    },
    {
      q: "What is the main advantage of using ACP/A2A for agent handoff?",
      options: [
        "Structured and reliable task transfer between agents",
        "Faster model training",
        "Reduced database size",
        "Improved image generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following is NOT a typical use case for MCP/ACP protocols?",
      options: [
        "Agent-to-agent task coordination",
        "Web page rendering",
        "Tool exposure",
        "Context sharing"
      ],
      answer: 1
    },
    {
      q: "Which of the following best describes the flow of an agent handoff using ACP?",
      options: [
        "Agent 1 receives task → Prepares message → Sends to Agent 2 → Agent 2 processes and responds",
        "Agent 1 trains model → Agent 2 stores embeddings",
        "Agent 1 generates image → Agent 2 displays image",
        "Agent 1 writes code → Agent 2 executes code"
      ],
      answer: 0
    }
  ],

  6: [ // Week 6 - Capstone Project & Integration
    {
      q: "What is the main goal of the Week 6 capstone project?",
      options: [
        "Integrate RAG, SQL, MCP, and ACP/A2A with evaluation and guardrails",
        "Train a neural network from scratch",
        "Build a web server",
        "Visualize embeddings"
      ],
      answer: 0
    },
    {
      q: "What is finetuning in the context of LLMs?",
      options: [
        "Adapting a pre-trained model to a specific task or dataset",
        "Training a model from scratch",
        "Evaluating model outputs",
        "Compressing the model"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a benefit of adding guardrails to LLM applications?",
      options: [
        "Improved safety and control over model outputs",
        "Faster model training",
        "Reduced database size",
        "Improved image generation"
      ],
      answer: 0
    },
    {
      q: "What is tracing in the context of GenAI applications?",
      options: [
        "Monitoring and recording the flow of data and decisions in the system",
        "Training neural networks",
        "Storing embeddings",
        "Generating prompts"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a key step in building an end-to-end GenAI system?",
      options: [
        "Integrating multiple components (RAG, SQL, MCP, ACP/A2A)",
        "Only using a single tool",
        "Ignoring evaluation",
        "Focusing only on model size"
      ],
      answer: 0
    },
    {
      q: "What is a capstone project?",
      options: [
        "A comprehensive project that integrates multiple skills and concepts",
        "A database schema",
        "A type of neural network",
        "A prompt template"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a best practice for evaluating end-to-end GenAI systems?",
      options: [
        "Use a golden set of test cases and measure relevant metrics",
        "Only test with random queries",
        "Never log errors",
        "Ignore user feedback"
      ],
      answer: 0
    },
    {
      q: "What is the main advantage of using tracing hooks in GenAI applications?",
      options: [
        "Easier debugging, monitoring, and improvement of system behavior",
        "Faster model training",
        "Reduced database size",
        "Improved image generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a limitation of end-to-end GenAI systems?",
      options: [
        "Increased complexity in integration and evaluation",
        "They always require internet access",
        "They cannot use prompt templates",
        "They only work for images"
      ],
      answer: 0
    },
    {
      q: "What is a recommended way to implement basic guardrails in LLM applications?",
      options: [
        "PII redaction and content filtering",
        "Ignore all errors",
        "Only log errors to a file",
        "Never validate user input"
      ],
      answer: 0
    },
    {
      q: "What is the role of evaluation in the capstone project?",
      options: [
        "To measure the effectiveness and reliability of the integrated system",
        "To train neural networks",
        "To store embeddings",
        "To generate prompts"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a key challenge in integrating RAG, SQL, MCP, and ACP/A2A?",
      options: [
        "Ensuring smooth data flow and communication between components",
        "Reducing model size",
        "Improving image generation",
        "Speeding up database queries"
      ],
      answer: 0
    },
    {
      q: "What is a benefit of including a README and demo script in the capstone project?",
      options: [
        "Improved reproducibility and ease of understanding for others",
        "Faster model training",
        "Reduced database size",
        "Improved image generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following is NOT a feature of a well-integrated GenAI system?",
      options: [
        "Lack of communication between components",
        "Seamless data flow",
        "Robust evaluation",
        "Basic guardrails"
      ],
      answer: 0
    },
    {
      q: "What is the main purpose of content filtering in LLM applications?",
      options: [
        "To prevent the generation of inappropriate or unsafe outputs",
        "To speed up model training",
        "To reduce database size",
        "To improve image generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a best practice for team-based capstone projects?",
      options: [
        "Collaborate, document, and test all components thoroughly",
        "Work in isolation",
        "Ignore documentation",
        "Never test the system"
      ],
      answer: 0
    },
    {
      q: "What is a limitation of using only one evaluation metric in GenAI systems?",
      options: [
        "It may not capture all aspects of system performance",
        "It speeds up model training",
        "It reduces database size",
        "It improves image generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following is a recommended way to improve system reliability?",
      options: [
        "Add tracing, guardrails, and thorough evaluation",
        "Ignore all errors",
        "Only log errors to a file",
        "Never validate user input"
      ],
      answer: 0
    },
    {
      q: "What is the main advantage of integrating multiple GenAI components?",
      options: [
        "Ability to solve more complex and realistic problems",
        "Faster model training",
        "Reduced database size",
        "Improved image generation"
      ],
      answer: 0
    },
    {
      q: "Which of the following best describes the flow of an end-to-end GenAI capstone system?",
      options: [
        "User query → RAG/SQL/MCP/ACP components → Evaluation/Guardrails → Final answer",
        "User query → LLM → Retriever → Answer",
        "User query → Database → Answer",
        "User query → Vector DB → Answer"
      ],
      answer: 0
    }
  ]
};

// Helper function to get random questions for a specific week
function getRandomQuestions(weekNumber, count = 10) {
  if (!quizQuestions[weekNumber]) {
    return [];
  }
  
  const allQuestions = quizQuestions[weekNumber];
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

module.exports = {
  quizQuestions,
  getRandomQuestions
};