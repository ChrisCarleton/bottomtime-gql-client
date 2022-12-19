import { gql } from '@apollo/client/core';

export const UserAllFields = gql`
  fragment UserAllFields on UserEntity {
    email
    emailVerified
    hasPassword
    id
    isLockedOut
    lastLogin
    memberSince
    role
    username
  }
`;
