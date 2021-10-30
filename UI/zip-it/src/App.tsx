import { useState } from "react";
import Header from "./components/elements/header";
import { useColorMode, useToast } from "@chakra-ui/react";
import Login, { LoginDetails } from "./components/forms/login";
import Logout from "./components/forms/logout";
import Register, { RestrationDetails } from "./components/forms/register";
import query from "./data/queries";
import mutation from "./data/mutations";
import clientConnection from "./data/client";
import { Listings } from "./components/display/itemlist";
import Confirmation, {
  ConfirmationDetails,
} from "./components/forms/confirmation";

interface LogInDetails {
  userID: number;
  userEmail: string;
  userEmailVerified: boolean;
}

function App() {
  const [userPostCode, setUserPostCode] = useState(0);
  const [userTitle, setUserTitle] = useState("Welcome");
  const [authenticated, setAuthenticated] = useState<LogInDetails>();
  const [logInDisabled, setLogInDisabled] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [registerDisabled, setRegisterDisabled] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationDisabled, setConfirmationDisabled] = useState(false);
  const { toggleColorMode } = useColorMode();
  const onShowLogin = () => {
    setLoginVisible(true);
    setLogInDisabled(false);
    setLogoutVisible(false);
    setRegisterVisible(false);
  };
  const onShowRegister = () => {
    setLogoutVisible(false);
    setLoginVisible(false);
    setRegisterVisible(true);
    setRegisterDisabled(false);
  };
  const onShowLogout = () => {
    setLogoutVisible(true);
    setLoginVisible(false);
    setRegisterVisible(false);
  };
  const onLogInClose = () => setLoginVisible(false);
  const onLogoutClose = () => setLogoutVisible(false);
  const onRegisterClose = () => setRegisterVisible(false);
  const onConfirmationClose = () => {
    setUserTitle("Welcome");
    setAuthenticated(undefined);

    setConfirmationVisible(false);
  };
  const toast = useToast();

  const registrationErrorToast = () =>
    toast({
      title: "Email already registered",
      description:
        "The email address you entered is already contained in the system, please either log in or register another email address.",
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "top",
    });

  const validationToast = () =>
    toast({
      title: "Sorry invalid - Try again?",
      description: "Invalid credentials.",
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "top",
    });

  const errorToast = () =>
    toast({
      title: "Sorry the system is down - Try later",
      description: "Invalid credentials.",
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "top",
    });

  //Logic for Login fucntion
  const onLogin = (props: LoginDetails) => {
    setLogInDisabled(true);

    //invoke client
    const client = clientConnection();

    //query database + pass result to
    client
      .query(query(props))
      .then((result) => {
        const queryResult = result.data.userByEmail;

        if (queryResult != null) {
          //set user data
          setUserTitle("Welcome back " + queryResult.userFirstName);
          setUserPostCode(queryResult.userPostCode);

          //hide login
          setLoginVisible(false);

          // Set the authenticated data
          const logInDetails: LogInDetails = {
            ...result.data.userByEmail,
          };

          setAuthenticated(logInDetails);

          if (authenticated?.userEmailVerified) {
            //login confirmation
            toast({
              title: "Logged In",
              description: "You have been successfully logged in.",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          } else {
            // Show the confirmation page
            setConfirmationVisible(true);
            setConfirmationDisabled(false);
          }
        } else {
          validationToast();
          setLogInDisabled(false);
        }
      })
      //catch apollo/graphQL failure
      .catch((result) => {
        console.log(result);
        errorToast();
        setLoginVisible(false);
        setLogInDisabled(false);
      });
  };

  //logic for logout function
  const onLogout = () => {
    //log out confirmation
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });

    //setheader title and authentication status
    setUserTitle("Welcome");
    setAuthenticated(undefined);
    setLogInDisabled(false);

    //hide login
    setLogoutVisible(false);
  };

  const onRegister = (props: RestrationDetails) => {
    //invoke client
    const client = clientConnection();
    const regProps = {
      type: "register",
      data: props,
    };

    //query database + pass result to
    client
      .mutate({ mutation: mutation(regProps) })
      .then((result) => {
        if (result.data.createUser.userID > 0) {
          //hide login
          setLoginVisible(false);

          // Set the authenticated data
          const logInDetails: LogInDetails = {
            ...result.data.createUser,
          };

          setAuthenticated(logInDetails);

          // Hide the registration page
          setRegisterVisible(false);

          // Show the confirmation page
          setConfirmationVisible(true);
          setConfirmationDisabled(false);
        } else {
          // Reenable the confirmation dialog
          setRegisterDisabled(false);

          // Show the error toast
          registrationErrorToast();
        }
      })
      //catch apollo/graphQL failure
      .catch((result) => {
        // Show the error toast
        errorToast();

        // Reenable the confirmation dialog
        setRegisterDisabled(false);
      });
  };

  const onConfirmation = (props: ConfirmationDetails) => {
    //invoke client
    const client = clientConnection();
    const confProps = {
      type: "confirm",
      data: {
        userEmail: authenticated?.userEmail,
        confirmationCode: props.confirmationCode,
      },
    };

    // Disable the confirmation
    setConfirmationDisabled(true);

    //query database + pass result to
    client
      .mutate({ mutation: mutation(confProps) })
      .then((result) => {
        if (result.data.confirmUser) {
          // Set the authenticated data
          const logInDetails: LogInDetails = {
            ...result.data.userByEmail,
          };

          setAuthenticated(logInDetails);

          // Show the account created toast
          toast({
            title: "Account Created",
            description: "Your account has been successfully verified.",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });

          // Hide the confirmation dialog
          setConfirmationVisible(false);
        } else {
          // Reenable the confirmation dialog
          setConfirmationDisabled(false);

          // Show the error toast
          errorToast();
        }
      })
      //catch apollo/graphQL failure
      .catch((result) => {
        // Show the error toast
        errorToast();

        // Reenable the confirmation dialog
        setConfirmationDisabled(false);
      });
  };

  return (
    <>
      <Header
        toggleColorMode={toggleColorMode}
        toggleLogIn={onShowLogin}
        toggleLogout={onShowLogout}
        userTitle={userTitle}
        authenticated={authenticated !== undefined}
      />
      <Login
        disabled={logInDisabled}
        visible={loginVisible}
        onOpenRegister={onShowRegister}
        onLogin={onLogin}
        onClose={onLogInClose}
      />
      <Confirmation
        disabled={confirmationDisabled}
        visible={confirmationVisible}
        onConfirm={onConfirmation}
        onClose={onConfirmationClose}
      />
      <Logout
        visible={logoutVisible}
        onLogout={onLogout}
        onClose={onLogoutClose}
      />
      <Register
        disabled={registerDisabled}
        visible={registerVisible}
        onOpenLogin={onShowLogin}
        onRegister={onRegister}
        onClose={onRegisterClose}
      />
      <Listings 
      userPostCode={userPostCode}/>
    </>
  );
}

export default App;
