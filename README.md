# ts-fastify-graphql

## Installation

1. `git clone https://github.com/Vanya1000/rsschool-nodejs-task-graphql.git`
2. `git checkout develop`
3. `npm install`

## Launching

    Run npm start to start the app.
    The app will be available at http://localhost:3000 for rest API and http://localhost:3000/graphql for graphQL
    You can change default port if create .env file and set variabe PORT=4000 for example.

## Other Scripts

    npm run check-integrity: Runs the check-integrity.js script.
    npm run test: Runs the tests for the project.
    npm run build:ts: Compiles TypeScript files.
    npm run watch:ts: Compiles TypeScript files in watch mode.
    npm run dev: Runs the TypeScript compiler in watch mode and starts the app.
    npm run dev:start: Starts the app in watch mode.

##Example query: 

## Get gql requests:

2.1. Get users, profiles, posts, memberTypes - 4 operations in one query: 

For post request:
```
{
  "query": "query GetUsersProfilesPostsMemberTypes { users { id firstName lastName email subscribedToUserIds } profiles { id avatar sex birthday country street city userId memberTypeId } posts { id title content userId } memberTypes { id discount monthPostsLimit } }"
}
```

For chrome extension
```
query GetUsersProfilesPostsMemberTypes {
  users {
    id
    firstName
    lastName
    email
    subscribedToUserIds
  }
  profiles {
    id
    avatar
    sex
    birthday
    country
    street
    city
    userId
    memberTypeId
  }
  posts {
    id
    title
    content
    userId
  }
  memberTypes {
    id
    discount
    monthPostsLimit
  }
}
```

2.2. Get user, profile, post, memberType by id - 4 operations in one query:

For post request:
```
{
  "query": "query GetUserProfilePostMemberTypeById ($userId: UUID!, $profileId: UUID!, $postId: UUID!, $memberTypeId: ID!) { user (id: $userId) { id firstName lastName email subscribedToUserIds } profile (id: $profileId) { id avatar sex birthday country street city userId memberTypeId } post (id: $postId) { id title content userId } memberType (id: $memberTypeId) { id discount monthPostsLimit } }",
  "variables": {
    "userId": "f8ea084c-2c46-4a5a-a16f-2467908e0cbb",
    "profileId": "412b6f29-cd94-417a-9081-bceda9b4d457",
    "postId":  "b5a7d927-0f68-4ed8-b97a-22b083eb5e40",
    "memberTypeId": "business"
  }
}
```

For chrome extension
```
query GetUserProfilePostMemberTypeById ($userId: UUID!, $profileId: UUID!, $postId: UUID!, $memberTypeId: ID!) {
  user (id: $userId) {
    id
    firstName
    lastName
    email
    subscribedToUserIds
  }
  profile (id: $profileId) {
    id
    avatar
    sex
    birthday
    country
    street
    city
    userId
    memberTypeId
  }
  post (id: $postId) {
    id
    title
    content
    userId
  }
  memberType (id: $memberTypeId) {
    id
    discount
    monthPostsLimit
  }
}
```
```
{
  "userId": "f8ea084c-2c46-4a5a-a16f-2467908e0cbb",
  "profileId": "412b6f29-cd94-417a-9081-bceda9b4d457",
  "postId":  "b5a7d927-0f68-4ed8-b97a-22b083eb5e40",
  "memberTypeId": "business"
}
```

2.3. Get users with their posts, profiles, memberTypes: 

For post request:
```
{
  "query": "query GetUsersWithTheirPostsProfilesMemberTypes { users { id firstName lastName email subscribedToUserIds posts { id title content userId } profile { id avatar sex birthday country street city userId memberTypeId memberType { id discount monthPostsLimit } } } }"
}

```

For chrome extension
```
query GetUsersWithTheirPostsProfilesMemberTypes {
  users {
    id
    firstName
    lastName
    email
    subscribedToUserIds
    posts {
      id
      title
      content
      userId
    }
    profile {
      id
      avatar
      sex
      birthday
      country
      street
      city
      userId
      memberTypeId
      memberType {
        id
        discount
        monthPostsLimit
      }
    }
  }
}
```

2.4. Get user by id with his posts, profile, memberType:

For post request:
```
{
  "query": "query GetUserbyIdWithHisPostsProfileMemberType ($userId: UUID!) { user (id: $userId) { id firstName lastName email subscribedToUserIds posts { id title content userId } profile { id avatar sex birthday country street city userId memberTypeId memberType { id discount monthPostsLimit } } } }",
  "variables": {
    "userId": "f8ea084c-2c46-4a5a-a16f-2467908e0cbb"
  }
}
```

For chrome extension
```
query GetUserbyIdWithHisPostsProfileMemberType ($userId: UUID!) {
  user (id: $userId) {
    id
    firstName
    lastName
    email
    subscribedToUserIds
    posts {
      id
      title
      content
      userId
    }
    profile {
      id
      avatar
      sex
      birthday
      country
      street
      city
      userId
      memberTypeId
      memberType {
        id
        discount
        monthPostsLimit
      }
    }
  }
}
```
```
{
  "userId": "f8ea084c-2c46-4a5a-a16f-2467908e0cbb"
}
```

2.5. Get users with their userSubscribedTo, profile:

For post request:
```
{
"query": "query UserSubscribedToProfile { users { userSubscribedTo { profile { id avatar sex birthday country street city userId memberTypeId } } } }"
}
```

For chrome extension
```
query UserSubscribedToProfile {
  users {
     userSubscribedTo {
      profile {
        id
        avatar
        sex
        birthday
        country
        street
        city
        userId
        memberTypeId
      }
    }
  }
}
```

2.6. Get user by id with his subscribedToUser, posts: 

For post request:
```
{
  "query": "query SubscribedToUserPosts ($id: UUID!) { user (id: $id) { subscribedToUser { posts { id title content userId } } } }",
  "variables": {
    "id": "f8ea084c-2c46-4a5a-a16f-2467908e0cbb"
  }
}
```

For chrome extension
```
query SubscribedToUserPosts ($id: UUID!) {
  user (id: $id) {
     subscribedToUser{
      posts {
        id
        title
        content
        userId
      }
    }
  }
}
```
```
{
  "id": "f8ea084c-2c46-4a5a-a16f-2467908e0cbb"
}
```

2.7. Get users with their userSubscribedTo, subscribedToUser (additionally for each user in userSubscribedTo, subscribedToUser add their userSubscribedTo, subscribedToUser).

For post request:
```
{
  "query": "query UserWithTheirUserSubscribedToSubscribedToUserAndSoOn { users { userSubscribedTo { id firstName lastName email userSubscribedTo { id firstName lastName email userSubscribedTo { id firstName lastName email } } } subscribedToUser { id firstName lastName email subscribedToUser { id firstName lastName email subscribedToUser { id firstName lastName } } } } }"
}
```

For chrome extension
```
query UserWithTheirUserSubscribedToSubscribedToUserAndSoOn {
  users {
     userSubscribedTo {
      id
      firstName
      lastName
      email
      userSubscribedTo {
        id
        firstName
        lastName
        email
        userSubscribedTo {
          id
          firstName
          lastName
          email
        }
      }
    }
    subscribedToUser {
      id
      firstName
      lastName
      email
      subscribedToUser {
        id
        firstName
        lastName
        email
        subscribedToUser {
          id
          firstName
          lastName
        }
      }
    }
  }
}
```


## Create gql requests:
2.8. Create user:

For post request:
```
{
  "query": "mutation CreateUser ($input: CreateUserInput!) { createUser (input: $input) { id firstName lastName } }",
  "variables": {
    "input": {
      "firstName": "John",
      "lastName": "Someone",
      "email": "johnsomeone@gmail.com"
    }
  }
}
```

For chrome extension
```
mutation CreateUser ($input: CreateUserInput!) {
  createUser (input: $input) {
    id
    firstName
    lastName
  }
}
```
```
{
  "input": {
    "firstName": "John",
    "lastName": "Someone",
    "email": "johnsomeone@gmail.com"
  }
}
```



2.9. Create profile:

For post request:
```
{
  "query": "mutation CreateProfile ($input: CreateProfileInput!) { createProfile (input: $input) { id avatar sex birthday country street city userId memberTypeId } }",
  "variables": {
    "input": {
      "avatar": "https://example.com/avatar.png",
      "sex": "male",
      "birthday": 1992,
      "country": "United States",
      "street": "Example St",
      "city": "Example City",
      "userId": "d4ac75e5-84a2-4eab-b30e-1a6f2c8b967f",
      "memberTypeId": "basic"
    }
  }
}
```

For chrome extension
```
mutation CreateProfile ($input: CreateProfileInput!) {
  createProfile (input: $input) {
    id
    avatar
    sex
    birthday
    country
    street
    city
    userId
    memberTypeId
  }
}
```
```
{
  "input": {
    "avatar": "https://example.com/avatar.png",
    "sex": "male",
    "birthday": 1992,
    "country": "United States",
    "street": "Example St",
    "city": "Example City",
    "userId": "d4ac75e5-84a2-4eab-b30e-1a6f2c8b967f",
    "memberTypeId": "basic"
  }
}
```


2.10. Create post:

For post request:
```
{
  "query": "mutation CreatePost ($input: CreatePostInput!) { createPost (input: $input) { id title content userId } }",
  "variables": {
    "input": {
      "title": "Some title",
      "content": "Some content",
      "userId": "0dccae13-efeb-4e48-b48d-085635d0a6f5"
    }
  }
}
```

For chrome extension
```
mutation CreatePost ($input: CreatePostInput!) {
  createPost (input: $input) {
    id
    title
    content
    userId
  }
}
```
```
{
  "input": {
    "title": "Some title",
    "content": "Some content",
    "userId": "0dccae13-efeb-4e48-b48d-085635d0a6f5"
  }
}
```

2.11. InputObjectType for DTOs.

In all mutations use InputObjectType for DTOs!

## Update gql requests:

2.12. Update user:

For post request:
```
{
  "query": "mutation UpdateUser ($id: UUID!, $input: UpdateUserInput!) { updateUser (id: $id, input: $input) { id firstName lastName email } }",
  "variables": {
    "id": "ffdf8ad0-68ce-4fe0-aeb9-cae898477fef",
    "input": {
      "firstName": "new Name",
      "lastName": " new Someone"
    }
  }
}
```

For chrome extension:
```
mutation UpdateUser ($id: UUID!, $input: UpdateUserInput!) {
  updateUser (id: $id, input: $input) {
    id
    firstName
    lastName
    email
  }
}
```
```
{
  "id": "ffdf8ad0-68ce-4fe0-aeb9-cae898477fef",
  "input": {
    "firstName": "new Name",
    "lastName": " new Someone"
  }
}
```

2.13. Update profile:

For post request:
```
{
  "query": "mutation UpdateProfile ($id: UUID!, $input: UpdateProfileInput!) { updateProfile (id: $id, input: $input) { id avatar sex birthday country street city userId memberTypeId } }",
  "variables": {
    "id": "43b58a28-f984-4578-af6c-18d8038d8789",
    "input": {
      "avatar": "https://example.com/avatar.png",
      "sex": "male",
      "birthday": 1992,
      "country": "new United States",
      "street": "new 123 Example St",
      "city": "new Example City",
      "userId": "2bd455d6-69ad-4275-9e5e-a7091cae2c90",
      "memberTypeId": "basic"
    }
  }
}
```

For chrome extension:
```
mutation UpdateProfile ($id: UUID!, $input: UpdateProfileInput!) {
  updateProfile (id: $id, input: $input) {
    id
    avatar
    sex
    birthday
    country
    street
    city
    userId
    memberTypeId
  }
}
```
```
{
  "id": "43b58a28-f984-4578-af6c-18d8038d8789",
  "input": {
    "avatar": "https://example.com/avatar.png",
    "sex": "male",
    "birthday": 1992,
    "country": "new United States",
    "street": "new 123 Example St",
    "city": "new Example City",
    "userId": "2bd455d6-69ad-4275-9e5e-a7091cae2c90",
    "memberTypeId": "basic"
  }
}
```

2.14. Update post:

For post request:
```
{
  "query": "mutation UpdatePost ($id: UUID!, $input: UpdatePostInput!) { updatePost (id: $id, input: $input) { id title content userId } }",
  "variables": {
    "id": "710a4eb1-5c79-4509-b189-08183b947eee",
    "input": {
      "title": "new Some title",
      "content": "new Some content",
      "userId": "2f678cdb-501b-4cac-a464-a563c2b41ca7"
    }
  }
}
```

For chrome extension:
```
mutation UpdatePost ($id: UUID!, $input: UpdatePostInput!) {
  updatePost (id: $id, input: $input) {
    id
    title
    content
    userId
  }
}
```
```
{
  "id": "710a4eb1-5c79-4509-b189-08183b947eee",
  "input": {
    "title": "new Some title",
    "content": "new Some content",
    "userId": "2f678cdb-501b-4cac-a464-a563c2b41ca7"
  }
}
```

2.15. Update memberType:

For post request:
```
{
  "query": "mutation UpdateMemberType ($id: ID!, $input: UpdateMemberTypeInput!) { updateMemberType (id: $id, input: $input) { id discount monthPostsLimit } }",
  "variables": {
    "id": "basic",
    "input": {
      "discount": 100,
      "monthPostsLimit": 1000
    }
  }
}
```

For chrome extension:
```
mutation UpdateMemberType ($id: ID!, $input: UpdateMemberTypeInput!) {
  updateMemberType (id: $id, input: $input) {
    id
    discount
    monthPostsLimit
  }
}
```
```
{
  "id": "basic",
  "input": {
    "discount": 100,
    "monthPostsLimit": 1000
  }
}
```

2.16. Subscribe to:

For post request:
```
{
  "query": "mutation SubscribeTo ($id: UUID!, $input: SubccribeToInput!) { subscribeTo (id: $id, input: $input) { subscribedToUserIds } }",
  "variables": {
    "id": "7e8c9879-801c-46ae-b930-5802ee8d32cb",
    "input": {
      "userId": "2a418b66-e48b-492e-80df-d8cecc3694df"
    }
  }
}
```

For chrome extension:
```
mutation SubscribeTo ($id: UUID!, $input: SubccribeToInput!) {
  subscribeTo (id: $id, input: $input) {
    subscribedToUserIds
  }
}
```
```
{ 
  "id": "7e8c9879-801c-46ae-b930-5802ee8d32cb",
  "input": {
    "userId": "2a418b66-e48b-492e-80df-d8cecc3694df"
  }
}
```


Unsubscribe from:

For post request:
```
{
  "query": "mutation UnsubscribeTo ($id: UUID!, $input: SubccribeToInput!) { unsubscribeTo (id: $id, input: $input) { subscribedToUserIds } }",
  "variables": {
    "id": "7e8c9879-801c-46ae-b930-5802ee8d32cb",
    "input": {
      "userId": "2a418b66-e48b-492e-80df-d8cecc3694df"
    }
  }
}
```

For chrome extension:
```
mutation UnsubscribeTo ($id: UUID!, $input: SubccribeToInput!) {
  unsubscribeTo (id: $id, input: $input) {
    subscribedToUserIds
  }
}
```
```
{ 
  "id": "936463ef-387d-4095-9a52-e1fcb3c68ff5",
  "input": {
    "userId": "2a418b66-e48b-492e-80df-d8cecc3694df"
  }
}
```

2.17. InputObjectType for DTOs.

In all mutations use InputObjectType for DTOs!