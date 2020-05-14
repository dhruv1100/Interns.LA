import React, { Component } from "react";
import _logger from "sabio-debug";
import * as venueService from "../../services/venueService";
import locationService from "../../services/locationService";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { venueValidationSchema } from "./venueValidationSchema";
import "./Venue.css";
import "../fileUpload/FileUpload";
import AsyncSelect from "react-select/async";
import FileUpload from "../fileUpload/FileUpload";
import swal from "sweetalert";

class VenueForm extends Component {
  state = {
    formData: {
      name: "",
      description: "",
      url: "",
      locationId: "",
      files: [],
      selectedLocation: {},
    },
    isEditing: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      const { state } = this.props.location;
      if (state) {
        this.setFormData(state);
      } else {
        venueService
          .getById(id)
          .then((response) => {
            this.setFormData(response.item);
          })
          .catch((err) => {
            _logger("err", err);
          });
      }
    }
  }

  setFormData = (venue) => {
    let locationObj = this.mapLocation(venue.location);
    this.setState((prevState) => {
      return {
        ...prevState,
        formData: {
          ...venue,
          selectedLocation: locationObj || {
            value: 0,
            label: "Please search for a location...",
          },
        },
        isEditing: true,
      };
    });
  };

  handleError = (err) => {
    _logger(err);
  };

  handleSubmit = (values) => {
    _logger("trying");
    if (this.props.match.params && this.props.match.params.id) {
      venueService
        .update(this.props.match.params.id, values)
        .then(this.editSuccess)
        .catch(this.editError);
    } else {
      debugger;
      venueService.add(values).then(this.addSuccess).catch(this.addError);
    }
  };

  editSuccess = () => {
    _logger("Venue Edit Success");
    swal({
      title: "Success",
      text: "You successfully Updated a Venue!",
      icon: "success",
      button: "Okay",
    });
    this.props.history.push("/venues");
  };

  editError = () => {
    _logger("Venue EditError");
  };

  addSuccess = () => {
    _logger("Venue Add Success");
    swal({
      title: "Success",
      text: "You successfully added a Venue!",
      icon: "success",
      button: "Okay",
    });
    this.props.history.push("/venues");
    this.venueGetAll();
  };

  addError = () => {
    _logger("VenueAdd Error");
  };

  loadOptions = (inputValue, callback) => {
    new Promise((resolve) => {
      resolve(this.searchForLocation(inputValue, callback));
    });
  };
  searchForLocation = (inputValue, callback) => {
    let pageIndex = 0;
    let pageSize = 20;
    locationService
      .search(inputValue, pageIndex, pageSize)
      .then((response) =>
        callback(response.item.pagedItems.map(this.mapLocation))
      )
      .catch(this.onlocationSearchError);
  };

  onlocationSearchError = (errRespnse) => {
    _logger("ERROR onlocationSearchError!", errRespnse);
  };

  mapLocation = (obj) => {
    let location;
    if (obj.state) {
      location = {
        value: obj.id,
        label: `${obj.lineOne} ${obj.city} ${obj.zip} ${obj.state.stateProvinceCode}`,
      };
    } else {
      location = {
        value: obj.id,
        label: `${obj.lineOne} ${obj.city} ${obj.zip} ${obj.stateName}`,
      };
    }
    return location;
  };

  handleLocationChange = (selected, setFieldValue) => {
    _logger(selected);
    setFieldValue("locationId", selected.value);
    setFieldValue("selectedLocation", selected);
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          enableReinitialize={true}
          initialValues={this.state.formData}
          validationSchema={venueValidationSchema}
          onSubmit={this.handleSubmit}
        >
          {(props) => {
            const { values, setFieldValue } = props;
            return (
              <Form>
                <div className="container-fuild">
                  <div className="row">
                    <div className="col-sm-12 col-md-4 mt-5 ml-4 mr-4">
                      <div className="maincard">
                        <img
                          alt="img"
                          className="card-img-top"
                          src={
                            values.files && values.files.length > 0
                              ? values.files[0].url
                              : "https://amerikicklanghorne.com/wp-content/uploads/2017/04/default-image.jpg"
                          }
                        />
                        <div className="card-body text-center">
                          <div className="m-1">
                            <strong>Name:</strong> {values.name}
                          </div>
                          <div className="m-1">
                            <strong>Description:</strong> {values.description}
                          </div>
                          <div className="m-1">
                            <strong>Url:</strong> {values.url}
                          </div>
                          <div className="m-1">
                            <strong>Location:</strong>{" "}
                            {values.selectedLocation.label}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 ml-auto col-sm-12 w-75 col-md-7 pl-4 container card formcard ">
                      {this.state.isEditing ? (
                        <h1 className="text-center">Edit Form</h1>
                      ) : (
                        <h1 className="text-center">Create Venue</h1>
                      )}
                      <div className="position-relative row form-group">
                        <label className="col-md-2 col-form-label">Name</label>
                        <div className="col-md-10">
                          <Field
                            name="name"
                            type="text"
                            className="form-control"
                            placeholder="Name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="field-error text-danger"
                          />
                        </div>
                        <label className="col-md-2 col-form-label">
                          Description
                        </label>
                        <div className="col-md-10">
                          <Field
                            name="description"
                            type="text"
                            className="form-control"
                            placeholder="Description"
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="field-error text-danger"
                          />
                        </div>
                        <label className="col-md-2 col-form-label">Url</label>
                        <div className="col-md-10">
                          <Field
                            name="url"
                            type="text"
                            className="form-control"
                            placeholder="Url"
                          />
                          <ErrorMessage
                            name="url"
                            component="div"
                            className="field-error text-danger"
                          />
                        </div>
                        <label className="col-md-2 col-form-label">
                          Location
                        </label>
                        <div className="col-md-10">
                          <AsyncSelect
                            loadOptions={this.loadOptions}
                            cacheOptions
                            defaultOptions
                            onChange={(selected) =>
                              this.handleLocationChange(selected, setFieldValue)
                            }
                            value={values.selectedLocation}
                          />
                          <ErrorMessage
                            name="locationId"
                            component="div"
                            className="field-error text-danger"
                          />
                        </div>
                        <label className="col-md-2 col-form-label">Image</label>
                        <div className="col-md-2">
                          <FileUpload
                            onUpload={(item) => {
                              const files = item.map((string) => {
                                return {
                                  createdBy: 0,
                                  modifiedBy: 0,
                                  url: string,
                                  FileTypeId: 1,
                                };
                              });
                              setFieldValue("files", files);
                            }}
                          />
                          <ErrorMessage
                            name="image"
                            component="div"
                            className="field-error text-danger"
                          />
                        </div>
                      </div>
                      {this.props.location.state && this.props.match.params ? (
                        <button
                          type="submit"
                          className="mb-2 ml-auto btn btn-outline-success formBtn"
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="mb-2 ml-auto btn btn-outline-success formBtn"
                        >
                          {this.state.isEditing ? "Update" : "Create"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
}
VenueForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      id: PropTypes.number,
      location: PropTypes.shape({}),
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
};
export default VenueForm;
