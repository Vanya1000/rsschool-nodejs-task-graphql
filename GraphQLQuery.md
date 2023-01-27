Get gql requests:
2.1. Get users, profiles, posts, memberTypes - 4 operations in one query: 

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

2.2. Get user, profile, post, memberType by id - 4 operations in one query:

query GetUserProfilePostMemberTypeById ($userId: ID!, $profileId: ID!, $postId: ID!, $memberTypeId: ID!) {
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

{
  "userId": "72a53bc4-c94c-4b3a-9c83-57ac9aad03c8",
  "profileId": "f14be4f2-f67c-4ec4-8857-29aead17ed13",
  "postId":  "9696ce44-7074-4a1c-8930-5bdbaf5b5f23",
  "memberTypeId": "business"
}

2.3. Get users with their posts, profiles, memberTypes:

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

2.4. Get user by id with his posts, profile, memberType:

query GetUserbyIdWithHisPostsProfileMemberType ($userId: ID!) {
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

{
  "userId": "38db537f-c876-4eec-9207-1b1e403c6893"
}

2.5. Get users with their userSubscribedTo, profile:

query GetUsersWithTheirUserSubscribedToProfile {
  users {
    id
    firstName
    lastName
    email
    subscribedToUserIds
    userSubscribedTo {
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

Create gql requests:

2.8. Create user:

mutation CreateUser ($input: CreateUserInput!) {
  createUser (input: $input) {
    id
    firstName
    lastName
  }
}

{
  "input": {
    "firstName": "John",
    "lastName": "Someone",
    "email": "johnsomeone@gmail.com"
  }
}

2.9. Create profile:

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

{
  "input": {
    "avatar": "https://example.com/avatar.png",
    "sex": "male",
    "birthday": 1992,
    "country": "United States",
    "street": "123 Example St",
    "city": "Example City",
    "userId": "d4ac75e5-84a2-4eab-b30e-1a6f2c8b967f",
    "memberTypeId": "basic"
  }
}

2.10. Create post.

mutation CreatePost ($input: CreatePostInput!) {
  createPost (input: $input) {
    id
    title
    content
    userId
  }
}


2.11. InputObjectType for DTOs.

Fully completed!



Update gql requests:

2.12. Update user.

mutation UpdateUser ($id: ID!, $input: UpdateUserInput!) {
  updateUser (id: $id, input: $input) {
    id
    firstName
    lastName
    email
  }
}

{
  "id": "d4ac75e5-84a2-4eab-b30e-1a6f2c8b967f",
  "input": {
    "firstName": "new Name",
    "lastName": " new Someone"
  }
}

2.13. Update profile.

mutation UpdateProfile ($id: ID!, $input: UpdateProfileInput!) {
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

{
  "id": "722ce83d-defe-4e72-9018-7f41ab380653",
  "input": {
    "avatar": "https://example.com/avatar.png",
    "sex": "male",
    "birthday": 1992,
    "country": "new United States",
    "street": "new 123 Example St",
    "city": "new Example City",
    "userId": "d4ac75e5-84a2-4eab-b30e-1a6f2c8b967f",
    "memberTypeId": "basic"
  }
}

2.14. Update post.

mutation UpdatePost ($id: ID!, $input: UpdatePostInput!) {
  updatePost (id: $id, input: $input) {
    id
    title
    content
    userId
  }
}

{
  "id": "2ad77eba-1cf8-411c-b9ed-88b54da642d6",
  "input": {
    "title": "new Some title",
    "content": "new Some content",
    "userId": "2f678cdb-501b-4cac-a464-a563c2b41ca7"
  }
}


2.15. Update memberType.

mutation UpdateMemberType ($id: ID!, $input: UpdateMemberTypeInput!) {
  updateMemberType (id: $id, input: $input) {
    id
    discount
    monthPostsLimit
  }
}

{
  "id": "basic",
  "input": {
    "discount": 100,
    "monthPostsLimit": 1000
  }
}

2.16. Subscribe to; unsubscribe from.

2.17. InputObjectType for DTOs.
Fully completed!