import { DocumentNode, gql } from "@apollo/client";

//fetches user authentication information
function mutation(props): DocumentNode {
    let result;

    if (props.type === "register") {
        result = gql`
                mutation {
                    createUser(input: { userFirstName: "${props.data.userFirstName}", userLastName: "${props.data.userLastName}", userEmail: "${props.data.userEmail}", userPassword: "${props.data.userPassword}", userStreet: "${props.data.userStreet}", userCity: "${props.data.userCity}", userState: "${props.data.userState}", userPostCode: ${props.data.userPostCode} }) {
                        userID
                        userEmail
                        userFirstName
                        userEmailVerified
                    }
                }
            `;
    } if (props.type === "confirm") {
        result = gql`
                mutation {
                    confirmUser(userEmail: "${props.data.userEmail}", confirmationCode: ${props.data.confirmationCode}) {
                        userID
                        userEmail
                        userFirstName
                        userEmailVerified
                    }
                }
            `;
// matching current input, will be changed in the future
} else if (props.type === "newListing") {
    result = gql`
            mutation {
                createListing(input: { userID: ${props.data.listingUserID}, postCode: "${props.data.listingPostcode}", title: "${props.data.listingTitle}", category: "${props.data.listingCategory}", price: "${props.data.listingPrice}" listingType: "${props.data.listingType}",  description: "${props.data.listingDescription}", prodCondition: "${props.data.listingCondition}", imageURL: "${props.data.listingImageURL}",}) {
                    listingID
                }
            }
        `;
}

return result;
}
export default mutation;
