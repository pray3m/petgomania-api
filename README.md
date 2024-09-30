# Petgomania API

## Database Schema Overview

This document outlines the database schema for the Petgomania platform. The schema consists of the following key entities: **Users**, **Roles**, **Products**, **Pets**, **Orders**, **Adoptions**, **Messages**, and **Conversations**.

### Database Schema Diagram

```mermaid
erDiagram
    USERS {
        int id
        string name
        string email
        string password
        string role
        datetime created_at
    }

    ROLES {
        int id
        string name
    }

    PRODUCTS {
        int id
        string title
        text description
        decimal price
        string category
        string image_url
        int user_id
        datetime created_at
        datetime updated_at
    }

    PETS {
        int id
        string name
        string breed
        int age
        text health_status
        text description
        string image_url
        int user_id
        datetime created_at
        datetime updated_at
    }

    ORDERS {
        int id
        int user_id
        int product_id
        int quantity
        decimal total_price
        string order_status
        datetime created_at
    }

    ADOPTIONS {
        int id
        int pet_id
        int adopter_id
        string status
        datetime created_at
    }

    MESSAGES {
        int id
        int conversation_id
        int sender_id
        text message
        datetime sent_at
    }

    CONVERSATIONS {
        int id
        int user1_id
        int user2_id
        datetime created_at
    }

    USERS ||--o{ PRODUCTS : "admin can list"
    USERS ||--o{ PETS : "can list"
    USERS ||--o{ ORDERS : "can place"
    USERS ||--o{ ADOPTIONS : "can adopt"
    USERS ||--o{ MESSAGES : "can send"
    USERS ||--o{ CONVERSATIONS : "can have"
    PETS ||--o{ ADOPTIONS : "can have"
    PRODUCTS ||--o{ ORDERS : "can have"
    CONVERSATIONS ||--o{ MESSAGES : "can have"
```
