import { gql } from "@apollo/client";

//fetches user authentication information
const query = (props) => {
  if (props.email != null) {
    return {
      query: gql`
              {
                userByEmail(email: "${props.email}", password: "${props.password}") {
                  userID
                  userEmail
                  userFirstName
                  userLastName
                  userStreet
                  userCity
                  userState
                  userEmailVerified
                  userPostCode
                  roleID
                }
              }
            `,
    };
  }
  //adminUserSearch(id: string, role: number, keyword: string):[User]
  if (
    props.emailIDSelection !== "emailIDSelection" &&
    props.emailIDSelection !== undefined
  ) {
    return {
      query: gql`
              {
                adminUserSearch(id:"",role:0,keyword:"${props.emailIDSelection}") {
                  userID
                  userEmail
                  userFirstName
                  userLastName
                  userStreet
                  userCity
                  userState
                  userEmailVerified
                  userPostCode
                  roleID
                }
              }
              `,
    };
  }
  if (
    props.listingIDSelection !== "listingIDSelection" &&
    props.listingIDSelection !== undefined
  ) {
    return {
      query: gql`
              {
                adminListingSearch(user:"",listingID:${props.listingIDSelection},keyword:"") {
                  listingID
                  listingTitle
                  listingDescription
                  listingType
                  listingPostCode
                  listingPrice
                }
              }
              `,
    };
  }
  if (
    props.listingsByFilter !== "listingsByFilter" &&
    props.listingsByFilter !== undefined
  ) {
    //fetches listings according to passed params
    return {
      query: gql`
              {
                listingsByFilter(listingPostCode:${
                  props.listingPostCode === undefined
                    ? 0
                    : props.listingPostCode
                },listingType:"${props.listingType}",listingCategory:"${
        props.listingCategory
      }") {
                  listingID
                  listingTitle
                  listingDescription
                  listingType
                  listingPostCode
                  listingPrice
                }
              }
              `,
    };
  } else {
    return {
      query: gql`
              {
                listingsByFilter(listingPostCode:${
                  props.listingPostCode < 800 ? 0 : props.listingPostCode
                },listingType:"${props.listingType}",listingCategory:"${
        props.listingCategory
      }") {
                  listingID
                  listingTitle
                  listingDescription
                  listingType
                  listingPostCode
                  listingPrice
                }
              }
              `,
    };
  }
};
export default query;
