import React, { Component } from "react";
import API from "../utils/API";
import './maintRecord.css';
import { withRouter, Link } from "react-router-dom";
import Navbar from '../components/Navbar copy';
import NavbarLink from '../components/NavbarLink';
import ActionBtn from '../components/ActionBtn';
import VehicleMaintBox from '../components/VehicleMaintBox';
import { Form } from "react-bootstrap";

class MaintRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            id: ""
        };
    };

    componentDidMount() {
        let location = this.props.match.params.id;
        this.setState({
            id: location
        }, () => {
            this.apiCall()
        })
    };
    apiCall = () => {
        API.getOneMaintRecord(this.state.id)
            .then((res) => {
                this.setState({
                    data: res.data[0]
                })
                this.getVehicleInfo();
            })
            .catch(err => {
                console.log(err)
            })
    }

    getVehicleInfo = () => {
        API.vehicleById(this.state.id)
            .then((res) => {
                this.setState({
                    vehicle: res.data[0]
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    signOut = () => { localStorage.clear(); window.location.reload(); }

    render() {
        return (
            <>
                <Navbar>
                    <div></div>
                    <Form inline>
                        <NavbarLink url='/Members'>My Garage</NavbarLink>
                        <NavbarLink url='/vehicles'>Add Vehicle</NavbarLink>
                        <ActionBtn handleClick={this.signOut}>Sign Out</ActionBtn>
                    </Form>
                </Navbar>
                <div className='garageWrapper'>
                    <div className='garageSidebar'>
                        {/* <CarInfoSidebar vehicle={this.state.vehicle}/> */}
                    </div>
                    <div className='garageMain'>
                        {/* <h1 className='garagePageTitle'></h1> */}
                        <img className='' src={this.state.data.imageUrl} alt='Maintenance' />
                        <br></br>
                        <br></br>
                        <br></br>
                        <VehicleMaintBox header={this.state.data.name}>
                            <p className='maintHomeInfo'>{this.state.data.description}</p>
                        </VehicleMaintBox>
                        {/* <VehicleMaintBox header='Parts'>
                            <FormLine lineTitle='Break Pads' lineHeadOne='Part Link' lineHeadTwo='Cost' lineValOne='url' lineValTwo='$45' />
                            <FormLine lineTitle='Break Cleaner' lineHeadOne='Part Link' lineHeadTwo='Cost' lineValOne='url' lineValTwo='$3' />
                            <FormLine lineTitle='Break Fluid' lineHeadOne='Part Link' lineHeadTwo='Cost' lineValOne='url' lineValTwo='$3' />
                        </VehicleMaintBox> */}
                    </div>
                    <div className='garageSidebar vehicleLinksSidebar'>
                        <div className='vehicleBoxLinkContainer'>
                            <Link to={`/vehicles/${this.state.data.VehicleId}`}>
                                <p className='vehicleBoxLink'>Back to Vehicle</p>
                            </Link>
                            <Link to={`/vehiclesMileage/${this.state.data.VehicleId}`}>
                                <p className='vehicleBoxLink'>Update Mileage</p>
                            </Link>
                            <Link to={`/NewMaintenance/${this.state.data.VehicleId}`}>
                                <p className='carBoxLink'>New Maintenance</p>
                            </Link>
                            <p className='vehicleBoxLinkRed'>Delete</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default withRouter(MaintRecord);