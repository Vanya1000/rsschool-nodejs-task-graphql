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

Update gql requests:

2.12. Update user.

mutation UpdateUser ($id: ID!, $input: UpdateUserInput!) {
  updateUser (id: $id input: $input) {
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