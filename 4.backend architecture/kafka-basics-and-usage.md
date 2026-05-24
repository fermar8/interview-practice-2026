# Kafka Basics and Usage

## What Apache Kafka Is

Apache Kafka is a distributed event streaming platform used to build real-time data pipelines and streaming applications.

It is designed for:

- High throughput
- Fault tolerance
- Horizontal scalability
- Low-latency reads and writes

Common use cases include:

- Log aggregation
- Real-time analytics
- Event sourcing
- Asynchronous communication between microservices

Kafka follows a publish-subscribe model:

- Producers publish messages (events) to topics
- Consumers subscribe to topics to read those events

Kafka includes built-in features such as:

- Message retention
- Replication
- Partitioning

These features help ensure durability, availability, and scalability.

## Why Kafka Fits Microservices

Kafka is often used in microservices architectures because it enables asynchronous communication and decouples services.

Benefits in this context:

- Services do not need direct synchronous calls for every interaction
- Independent scaling of producers and consumers
- Better resilience when one service is slow or temporarily unavailable

## Kafka Workflow (End-to-End)

When an event occurs, the producer API publishes it to a Kafka topic.

A record typically contains:

- Key
- Value
- Timestamp
- Optional headers (metadata)

How data is stored and distributed:

- Records are appended to the topic log
- A topic log is ordered and immutable
- Topics are distributed and replicated across a cluster of Kafka brokers
- Each topic is split into partitions
- Partitions are ordered, immutable, append-only sequences of records
- Every record in a partition has a unique sequential offset

Read behavior and offset control:

- Consumers can consume specific partitions
- Consumers can read from specific offsets
- Offsets can be committed automatically or manually
- Manual commits provide more control and help prevent record loss on failures

Consumer groups:

- Multiple consumers can collaborate as a consumer group
- Partitions are divided among consumers in the same group
- This enables parallel processing and higher scalability

Leader and replication flow:

- A produced record is written to the leader partition first
- The record is replicated to other brokers for fault tolerance

![Kafka broker visual representation](kafka-broker.png)

## Consumer Patterns

Consumers can process records in several ways:

- In order, similar to queue-like processing
- As a real-time stream of updates
- From a chosen offset for reprocessing/history
- In batches for better throughput

## Kafka Streams

Kafka provides Kafka Streams, a stream processing API for real-time applications.

It supports:

- Filtering
- Transforming
- Aggregating
- Stateful processing

Stateful processing means keeping information across records, for example:

- Counting events by key
- Tracking the last value seen for a key
- Enabling windowed computations and other advanced logic

## Performance, Scale, and Reliability Characteristics

Kafka is designed to:

- Handle higher throughput than many traditional message brokers
- Support many concurrent producers and consumers
- Scale horizontally by adding brokers
- Survive broker failures through replication and failover

Additional reliability and recovery features:

- Replayability: consumers can re-read from any point in the log
- Dead Letter Queue (DLQ) patterns can isolate failed messages from the main flow

## Online Casino Use Case (Microservices)

Kafka is a strong fit for an online casino where many real-time events occur:

- Player actions
- Game state changes
- Transactions

Example flow:

- A player places a bet
- Betting service publishes an event to Kafka
- Other services consume it, such as:
- Game engine
- Payment service
- Analytics service

Why this matters:

- Low-latency event propagation is critical in casino workloads
- High throughput handles many concurrent players and transactions
- Decoupled services improve maintainability and scaling

## Advantages in an Online Casino Context

1. Scalability: handles large numbers of concurrent producers/consumers and high event volume.
2. Fault tolerance: replication and failover reduce risk of data loss.
3. Real-time processing: supports low-latency event-driven behavior.
4. Service decoupling: publish-subscribe model improves modularity and maintainability.
5. Replayability: enables reprocessing for analytics, recovery, and debugging.
6. DLQ support (pattern): isolates problematic messages without disrupting primary flow.

## Disadvantages in an Online Casino Context

1. Complexity: setup and operations can be challenging, especially for new teams.
2. Learning curve: architecture and operational model take time to master.
3. Operational overhead: requires monitoring, maintenance, and tuning.
4. Latency limits: low latency is good, but may not fit ultra-low-latency edge cases.
5. Cost at scale: infrastructure and/or managed service costs can become significant.

## Kafka + RabbitMQ Combination (When Needed)

For very high reliability and mixed latency requirements, a hybrid approach can be used:

- Kafka for high-throughput, real-time event streams
- RabbitMQ for low-latency, critical messages requiring strict delivery guarantees

This approach can combine the strengths of both systems for a robust messaging architecture.