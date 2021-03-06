import React, { Component } from "react";
import Message from "../components/Message";
import { Link, withRouter } from "react-router-dom";
import "./vehicleDisplay.css";
import API from "../utils/API";
import Navbar from '../components/Navbar copy';
import NavbarLink from '../components/NavbarLink';
import ActionBtn from '../components/ActionBtn';
import FormLine from '../components/FormLine';
import VehicleMaintBox from '../components/VehicleMaintBox';
import VehicleOverviewBox from '../components/VehicleOverviewBox';
import CarInfoSidebar from '../components/CarInfoSidebar';
import VINDecoder from '../components/VINDecoder';
import CarMd from '../components/CarMd';
import axios from 'axios'
import { Form } from "react-bootstrap";
import Iframe from "react-iframe";

class VehicleDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      carmdVinData: {
        year: '?',
        make: '?',
        model: '?',
        engine: '?',
        trim: '?',
        transmission: '?',
      },
      vehicleID: "",
      vehicle: {},
      conditionDescription: "",
      maintRecords: [],
      maintRecordsTable: {},
      url: "https://www.google.com/maps/embed/v1/search?key=AIzaSyARakaUOSHnemUU6-KrvQTD2Mpc9JwcdO0&q=car+maintenance+near+saltlakecity",
      title: "Car Maintenance Salt Lake City, Utah"
    };
  };
  componentDidMount() {
    //get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const coordinates = {
          coordinates: position.coords.latitude + "," + position.coords.longitude
        }
        //use user's coordinates to get city and state
        // API
        //   .getLocation(coordinates)
        //   .then(data => {
        //     this.setState({
        //       url: this.state.url + data.data.message,
        //       title: this.state.title + data.data.message
        //     })
        //   })
        //   .catch(err => console.log(err));
      });
    }
    //get vehicle id
    let location = this.props.match.params.id;
    this.setState({
      vehicleID: location
    }, () => {
      this.apiCall()
    })
  };
  apiCall = () => {
    API.vehicleById(this.state.vehicleID)
      .then((res) => {
        this.setState({
          vehicle: res.data[0]
        })
      })
      .catch(err => {
        console.log(err)
      })
      .then(() => {
        this.setCondition();
        this.maintRecords();
      })
  }
  setCondition() {
    switch (this.state.vehicle.condition) {
      case "Excellent":
        this.setState({
          conditionDescription: "Looks new and is in excellent mechanical condition!"
        });
        break;
      case "Fair":
        this.setState({
          conditionDescription: "Has some repairable cosmetic defects and is free of major mechanical problems."
        });
        break;
      case "Poor":
        this.setState({
          conditionDescription: "Has some cosmetic defects that require repairing and/or mechanical problems."
        });
        break;
      default: this.setState({
        condition: "No Description Available"
      })
    }
  };

  maintRecords() {
    API.getMaintRecords(this.state.vehicleID)
      .then((res) => {
        this.setState({
          maintRecords: res.data
        })
      })

      .catch(err => {
        console.log(err)
      })

  };

  vinSubmit = (e) => {
    axios.get('http://api.carmd.com/v3.0/decode?vin=' + this.state.vehicle.vin, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic OTZlYzhiZTEtZjIwZi00YWM0LWEyODAtZGI2NDliZGVkMmU5",
        "partner-token": "026c5798aa9642848403cec554d316a2"
      }
    }).then(response => {
      // console.log(response);
      this.setState({
        ...this.state,
        carmdVinData: response.data.data
      })
    });
  }
  signOut = () => { localStorage.clear(); window.location.reload(); }

  deleteVehicle = () => {
    API
      .deleteVehicle(this.state.vehicleID)
      .then(() => {
        this.props.history.push("/Members");
        const info = ["Vehicle Deleted", "success", "animate__bounceIn", "animate__bounceOut"];
        Message(info);
      })
      .catch(err => {
        // const info = [err.message, "danger", "animate__shakeX", "animate__fadeOut"];
        // Message(info);
        console.log(err.message)
      });
  }

  render() {
    return (
      <>
        <Navbar>
          <div></div>
          <Form inline>
            <NavbarLink url='/members'>My Garage</NavbarLink>
            <NavbarLink url='/vehicles'>Add Vehicle</NavbarLink>
            <ActionBtn handleClick={this.signOut}>Sign Out</ActionBtn>
          </Form>
        </Navbar>
        <div className='garageWrapper'>
          <div className='garageSidebar'>
            <CarInfoSidebar vehicle={this.state.vehicle} />
          </div>
          <div className='garageMain'>
            <h1 className='garagePageTitle'>{this.state.vehicle.make} {this.state.vehicle.model}</h1>
            <br></br>
            <br></br>
            <br></br>
            <VehicleOverviewBox title="Vehicle Overview" vehicle={this.state.vehicle} />
            <VehicleMaintBox header='Recent Maintenance'>
              {this.state.maintRecords.map(job => (
                <span key={job.id}>
                  <Link to={`/MaintRecord/${job.id}`}>
                    <FormLine lineTitle={job.name} lineHeadOne='Service Date' lineHeadTwo='Service Mileage' lineValOne={job.jobDate} lineValTwo={job.mileage} />
                  </Link>
                </span>
              ))}
            </VehicleMaintBox>

            {/* box for google map */}
            <div className='vehicleInfoBox'>
              <div className='maintenanceDisplayTopInfo'>
                <h2 className='maintenanceDisplayTitle'>{this.state.title}</h2>
              </div>
              <Iframe url={this.state.url}
                width="600"
                height="450"
                styles={{ border: 0 }} />
            </div>

            <VINDecoder vehicle={this.state.vehicle} onSubmit={this.vinSubmit} carmdVinData={this.state.carmdVinData} />
            <CarMd header="CarMd API Requests" />
          </div>
          <div className='garageSidebar vehicleLinksSidebar'>
            <div className='vehicleBoxLinkContainer'>
              <Link to={`/vehiclesMileage/${this.state.vehicle.id}`}>
                <p className='vehicleBoxLink'>Update Mileage</p>
              </Link>
              <Link to={`/NewMaintenance/${this.state.vehicle.id}`}>
                <p className='vehicleBoxLink'>New Maintenance</p>
              </Link>
              <p className='vehicleBoxLinkRed' onClick={this.deleteVehicle}>Delete</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(VehicleDisplay);