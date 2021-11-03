import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Select,
  Button, Alert, AlertIcon, AlertDescription, FormControl
} from '@chakra-ui/react';
import { Flex, Spacer } from '@chakra-ui/layout';
import { useState } from 'react';
import { LoginDetails } from './login';

export interface newListingDetails {
  listingUserID: number;
  listingPostCode: number;
  listingType: string;
  listingTitle: string;
  listingCategory: string;
  listingCondition: string;
  listingAvailability: string;
  listingPrice: number;
  listingDescription: string;
  listingImageURL: string;
}

export interface newListingProps {
  onNewListing(props: newListingDetails): void;
  onClose(): void;
  visible: boolean;
  disabled: boolean;
  listingUserID: number;
  listingPostCode: number;
}

export function NewListing(props: newListingProps) {
  const [formValidationMessage, setFormValidationMessage] = useState('')
  const [formValidationHidden, setFormValidationHidden] = useState(true)
  const [listingTitle, setTitle] = useState('')
  const [listingCategory, setCategory] = useState('')
  const [listingPrice, setPrice] = useState(0)
  const [listingType, setType] = useState('')
  const [listingDescription, setDescription] = useState('')
  const [listingAvailability, setAvailability] = useState('')
  const [listingImageURL, setImage] = useState('')
  const [listingCondition, setCondition] = useState('')

  const titleOnChange = (event) => setTitle(event.target.value)
  const categoryOnChange = (event) => setCategory(event.target.value)
  const priceOnChange = (event) => setPrice(event.target.value)
  const typeOnChange = (event) => setType(event.target.value)
  const descriptionOnChange = (event) => setDescription(event.target.value)
  const availabilityOnChange = (event) => setAvailability(event.target.value)
  const imageOnChange = (event) => setImage(event.target.value)
  const conditionOnChange = (event) => setCondition(event.target.value)

  const onNewListing = () => {
    const newListingDetails: newListingDetails = {
      listingUserID: props.listingUserID,
      listingPostCode: props.listingPostCode,
      listingTitle: listingTitle,
      listingCategory: listingCategory,
      listingPrice: listingPrice,
      listingType: listingType,
      listingDescription: listingDescription,
      listingAvailability: listingAvailability,
      listingImageURL: listingImageURL,
      listingCondition: listingCondition,
    };

    setFormValidationHidden(false);

    if (listingTitle === "") {
      setFormValidationMessage("Your listing title is empty");
    } else if (listingPrice === null) {
      setFormValidationMessage("Your listing price is empty");
    } else if (listingDescription === "") {
      setFormValidationMessage("Your description is empty");
    } else {
      setFormValidationHidden(true);
      props.onNewListing(newListingDetails);
    }
  };

  function CategorySelection() {
    if (listingType === 'product') {
      return (
        <>
          <Select
            placeholder="Category"
            type="category"
            id="category"
            onChange={categoryOnChange}>
            <option value="carparts">Car Parts</option>
            <option value="shoes">Shoes</option>
            <option value="computerparts">Computer Parts</option>
            <option value="cards">Collector Cards</option>
          </Select>
        </>
      );
    }
    if (listingType === 'service') {
      return (
        <>
          <Select
            placeholder="Qualification"
            type="category"
            id="category"
            onChange={categoryOnChange}>
            <option value="qualified">Qualified</option>
            <option value="licenced">Qualified and Certified</option>
            <option value="unqualified">Unqualified and Uncertified</option>
          </Select>
        </>
      );
    } else {
      return (
        <>
          <Select
            placeholder="Category"
            type="category"
            id="category"
            onChange={categoryOnChange}
            disabled
          ></Select>
        </>
      );
    }
  }

  function AvailabilitySelection() {
    if (listingType === 'service') {
      return (
        <>
          <Select 
            placeholder="Availibile Until"
            type="availability"
            id="availibility"
            onChange={availabilityOnChange}
          >
            <option value="tbd">TBD(Date Entry)</option>
          </Select>
        </>
      );
    } else {
      return (
        <>
          <Select
            placeholder="Availability"
            type='availability'
            id='availability'
            onChange={availabilityOnChange}
            disabled
          ></Select>
        </>
      );
    }
  }
  

  function ConditionSelection() {
    if (listingType === 'product') {
      return (
        <>
          <Select 
            placeholder="Condition"
            type='condition'
            id='condition'
            onChange={conditionOnChange}
          >
            <option value="likenew">Like New</option>
            <option value="barelyused">Barely Used</option>
            <option value="goodcondition">Good Condition</option>
            <option value="wellused">Well used</option>
          </Select>
        </>
      );
    } else {
      return (
        <>
          <Select
            placeholder="Condition"
            type='condition'
            id='condition'
            onChange={conditionOnChange}
            disabled
          ></Select>
        </>
      );
    }
  }

  return (
    <FormControl>
      <Modal isOpen={props.visible} onClose={props.onClose} id="newListing">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" hidden={formValidationHidden} mb={3}>
              <AlertIcon />
              <AlertDescription>{formValidationMessage}</AlertDescription>
            </Alert>
            Listing Title:
            <Input onChange={titleOnChange} placeholder="Create a title for your listing here" variant="filled" mb={3} type="title" id="title" />
            Listing Price:
            $<Input onChange={priceOnChange} placeholder="Create a listing price here" variant="filled" mb={3} type="price" id="price" />
            Listing Type:
            <Select
              placeholder="Products or Services" type="type" id="type" onChange={typeOnChange}>
              <option value="product">Product</option>
              <option value="service">Service</option>
            </Select>
            Listing Category:
            <CategorySelection />
            Listing Description:
            <Input onChange={descriptionOnChange} placeholder="Create a listing description here" variant="filled" mb={3} type="description" id="description" />
            Listing Condition:
            <ConditionSelection />
            Listing Availability:
            <AvailabilitySelection />
            Image:
            <Input onChange={imageOnChange} placeholder="Place an image URL here" variant="filled" mb={3} type="imageurl" id="imageurl" />
          </ModalBody>

          <ModalFooter>
            <Flex width="100%">
              <Button onClick={onNewListing}
                id="newListing">
                New Listing
              </Button>
              <Spacer></Spacer>
              <Button onClick={props.onClose}
                id="cancel">
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormControl>
  );
}

export default NewListing;