import Message from "../components/Message";
import React, { useContext, useState } from "react";
import './vehicles.css';
import FormInputTwo from "../components/FormInputTwo";
import API from "../utils/API";
import { AuthContext } from "../utils/authContext";
import Navbar from '../components/Navbar copy';
import NavbarLink from '../components/NavbarLink';
import ActionBtn from '../components/ActionBtn';
import FormImg from '../components/FormImg';
import ImageUpload from '../components/imageUpload/imageUpload';
import { app } from "../utils/base";
import { Form, Spinner } from "react-bootstrap";
const db = app.firestore();

export default function Vehicles(props) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [mileage, setMileage] = useState("");
  const [yearPurchased, setYearPurchased] = useState("");
  const [accidents, setAccidents] = useState("");
  const [locationLastOwned, setLocationLastOwned] = useState("");

  const [spinner, setSpinner] = useState("d-none");
  const [disable, setDisable] = useState("");
  const [button, setButton] = useState("Add Vehicle");

  const [activeType, setActiveType] = useState({
    car: true,
    truck: false,
    bike: false
  });
  const [vehicleType, setVehicleType] = useState("Car");
  const [activeCondition, setActiveCondition] = useState({
    good: true,
    fair: false,
    poor: false
  });
  const [vehicleCondition, setVehicleCondition] = useState("Good");
  const [activeOwners, SetActiveOwners] = useState({
    one: false,
    two: true,
    three: false,
    more: false
  });
  const [vehicleOwners, setVehicleOwners] = useState(2);
  const [file, setFile] = useState({});
  const [userId, setUserId] = useContext(AuthContext);

  const signOut = () => { setUserId({ showNotification: true }); localStorage.clear(); window.location.reload(); }

  const handleInputChange = event => {
    // Getting the value and name of the input which triggered the change
    let value = event.target.value;
    const name = event.target.id;

    if (name === "make") {
      setMake(value);
    } if (name === "model") {
      setModel(value);
    } if (name === "year") {
      setYear(value);
    } if (name === "vin") {
      setVin(value);
    } if (name === "mileage") {
      setMileage(value);
    } if (name === "yearPurchased") {
      setYearPurchased(value);
    } if (name === "accidents") {
      setAccidents(value);
    } if (name === "locationLastOwned") {
      setLocationLastOwned(value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let vehicleNew = {
      type: vehicleType,
      make: make,
      model: model,
      year: year,
      vin: vin,
      mileage: mileage,
      yearPurchased: yearPurchased,
      condition: vehicleCondition,
      accidents: accidents,
      numOfOwners: vehicleOwners,
      locationLastOwned: locationLastOwned,
      UserId: JSON.parse(localStorage.getItem("jwt.Token")).id,
      imageUrl: ""
    };
    if (!vehicleType || !make || !model || !year || !vin || !mileage || !yearPurchased || !vehicleCondition || !accidents || !vehicleOwners || !locationLastOwned) {
      const info = ["Please fill out all the required fields!", "warning", "animate__shakeX", "animate__fadeOut"]
      Message(info);
      return;
    }
    if (navigator.onLine && file.name) {
      setDisable("true");
      setSpinner("");
      setButton("Uploading...");
      const storageRef = app.storage().ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      vehicleNew.imageUrl = await fileRef.getDownloadURL();
      setDisable("");
      setSpinner("d-none");
      setButton("Upload complete");
    }
    API.newVehicle(vehicleNew)
      .then(() => {
        setUserId({ showNotification: true });
        props.history.push("/Members");
        const info = ["Added new vehicle.", "success", "animate__bounceIn", "animate__bounceOut"]
        Message(info);
      })
      .catch(() => {
        const info = ["You are offline vehicle will be added when you are online.", "danger", "animate__shakeX", "animate__fadeOut"]
        Message(info);
        //save all the vehicles added when offline
        if (JSON.parse(localStorage.getItem("offline"))) {
          const temp = JSON.parse(localStorage.getItem("offline"));
          temp.push(vehicleNew);
          localStorage.setItem("offline", JSON.stringify(temp));
        } else {
          localStorage.setItem("offline", JSON.stringify([vehicleNew]));
        }
      });
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleSelectionClick = (e) => {
    e.preventDefault();
    const choiceField = e.target.dataset.field;
    const choiceValue = e.target.dataset.value;
    const choiceId = e.target.id;
    switch (choiceField) {
      case "vehicleType":
        setVehicleType(choiceId)
        setActiveType({ [choiceValue]: true })
        break;
      case "vehicleCondition":
        setVehicleCondition(choiceId)
        setActiveCondition({ [choiceValue]: true })
        break;
      case "vehicleOwners":
        setVehicleOwners(choiceId)
        SetActiveOwners({ [choiceValue]: true })
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Navbar>
        <div></div>
        <Form inline>
          <NavbarLink url='/members'>My Garage</NavbarLink>
          <NavbarLink url='/vehicles' active={true}>Add Vehicle</NavbarLink>
          <ActionBtn handleClick={signOut}>Sign Out</ActionBtn>
        </Form>
      </Navbar>
      <Form>
        <div className='addCarFlex'>
          <div className='width40 carSelectionFormat'>
            <h2 className='addCarSubHeader'>Select Vehicle Type</h2>
            <div className="carFormInputWrapper">
              <FormImg id='Car' dataField='vehicleType' dataValue='car' src='car_gray.png' srcActive='car_blue.png' imgName='Car' active={activeType.car} handleSelectionClick={handleSelectionClick}></FormImg>
              <FormImg id='Truck' dataField='vehicleType' dataValue='truck' src='truck_gray.png' srcActive='truck_blue.png' imgName='Truck' active={activeType.truck} handleSelectionClick={handleSelectionClick}></FormImg>
              <FormImg id='Motorcycle' dataField='vehicleType' dataValue='bike' src='bike_gray.png' srcActive='bike_blue.png' imgName='Motorcycle' active={activeType.bike} handleSelectionClick={handleSelectionClick}></FormImg>
            </div>
            <h2 className='addCarSubHeader'>Vehicle Condition</h2>
            <div className="carFormInputWrapper">
              <FormImg id='Good' dataField='vehicleCondition' dataValue='good' src='good_gray.png' srcActive='good_blue.png' imgName='Good' active={activeCondition.good} handleSelectionClick={handleSelectionClick}></FormImg>
              <FormImg id='Fair' dataField='vehicleCondition' dataValue='fair' src='fair_gray.png' srcActive='fair_blue.png' imgName='Fair' active={activeCondition.fair} handleSelectionClick={handleSelectionClick}></FormImg>
              <FormImg id='Poor' dataField='vehicleCondition' dataValue='poor' src='poor_gray.png' srcActive='poor_blue.png' imgName='Poor' active={activeCondition.poor} handleSelectionClick={handleSelectionClick}></FormImg>
            </div>
            <h2 className='addCarSubHeader'>Number of Owners</h2>
            <div className="carFormInputWrapper">
              <FormImg id={1} dataField='vehicleOwners' dataValue='one' src='one_gray.png' srcActive='one_blue.png' imgName='One' active={activeOwners.one} handleSelectionClick={handleSelectionClick}></FormImg>
              <FormImg id={2} dataField='vehicleOwners' dataValue='two' src='two_gray.png' srcActive='two_blue.png' imgName='Two' active={activeOwners.two} handleSelectionClick={handleSelectionClick}></FormImg>
              <FormImg id={3} dataField='vehicleOwners' dataValue='three' src='three_gray.png' srcActive='three_blue.png' imgName='Three' active={activeOwners.three} handleSelectionClick={handleSelectionClick}></FormImg>
              <FormImg id={4} dataField='vehicleOwners' dataValue='more' src='more_gray.png' srcActive='more_blue.png' imgName='More' active={activeOwners.more} handleSelectionClick={handleSelectionClick}></FormImg>
            </div>
          </div>
          <div className='addCarWrapper'>
            <h1 className='addCarHeader'>Add a Vehicle</h1>
            <h1 className='addCarSubHeader'>Please fill out the required fields for adding your new vehicle</h1>
            <br></br>
            <br></br>
            <span className='flex'>
              <FormInputTwo setWidth='width45' name='make' type='text' label='Make' id="make" value={make} handleInputChange={handleInputChange}></FormInputTwo>
              <FormInputTwo setWidth='width45' name='model' type='text' label='Model' id="model" value={model} handleInputChange={handleInputChange}></FormInputTwo>
            </span>
            <FormInputTwo setWidth='width100' name='vin' type='text' label='Vin' id="vin" value={vin} handleInputChange={handleInputChange}></FormInputTwo>
            <FormInputTwo setWidth='width100' name='location' type='text' label='Location' id="locationLastOwned" value={locationLastOwned} handleInputChange={handleInputChange}></FormInputTwo>
            <span className='flex'>
              <FormInputTwo setWidth='width45' name='vehicleYear' type='text' label='Vehicle Year' id="year" value={year} handleInputChange={handleInputChange}></FormInputTwo>
              <FormInputTwo setWidth='width45' name='milage' type='text' label='Milage' id="mileage" value={mileage} handleInputChange={handleInputChange}></FormInputTwo>
            </span>
            <span className='flex'>
              <FormInputTwo setWidth='width45' name='yearOfPurchase' type='text' label='Year of Purchase' id="yearPurchased" value={yearPurchased} handleInputChange={handleInputChange}></FormInputTwo>
              <FormInputTwo setWidth='width45' name='accidents' type='text' label='Number of Accidents' id="accidents" value={accidents} handleInputChange={handleInputChange}></FormInputTwo>
            </span>
            <span>
              <label className='photoFileLabel'>Add Photo</label>
              <ImageUpload onFileChange={onFileChange} />
            </span>
            <ActionBtn handleClick={handleFormSubmit} disabled={disable}>{button}<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className={spinner} /></ActionBtn>
          </div>
        </div>
      </Form>
    </>
  );
}