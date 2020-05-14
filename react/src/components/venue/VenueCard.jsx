import React from "react";
import PropTypes from "prop-types";
import { FaEdit } from "react-icons/fa";
import "./Venue.css";
import _logger from "sabio-debug";

const VenueCard = (props) => {
  const editVenue = () => {
    props.handleEdit(props.venue);
    _logger(props);
  };

  // const deleteVenue = () => {
  //   props.handleDelete(props.venue.id);
  // };

  let img =
    "https://amerikicklanghorne.com/wp-content/uploads/2017/04/default-image.jpg";

  if (props.venue.files && props.venue.files[0].url) {
    img = props.venue.files[0].url;
  } else {
    img =
      "https://amerikicklanghorne.com/wp-content/uploads/2017/04/default-image.jpg";
  }

  return (
    <React.Fragment>
      <div className="col-lg-6 col-xl-4 ">
        <div className="mb-5 maincard">
          <img alt="img" className="card-img-top" src={img} />

          <div className="card-body">
            <h5 className="card-title font-weight-bold font-size-lg text-center">
              VenueName: {props.venue.name}
            </h5>
            <p className="text-center">
              Description: {props.venue.description}
            </p>
            <p className="text-center">Url: {props.venue.url}</p>
            <p className="text-center">
              Address:
              {`${props.venue.location.lineOne},
              ${props.venue.location.city},
              ${props.venue.location.stateProvinceCode}`}
            </p>
            {(props.role === "Seeker" || props.role === "Admin") &&
            props.userId === props.venue.createdBy ? (
              <button
                type="button"
                onClick={editVenue}
                className="btn btn-edit "
              >
                <FaEdit size="25" />
              </button>
            ) : null}
            {/* {(props.role === "Seeker" || props.role === "Admin") &&
            props.userId === props.venue.createdBy ? (
              <button
                type="button"
                className="btn btn-delete float-right"
                onClick={deleteVenue}
              >
                <FaTrashAlt size="20" />
              </button>
            ) : null} */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

VenueCard.propTypes = {
  role: PropTypes.string,
  userId: PropTypes.number,
  loginUser: PropTypes.number,
  venue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    dateCreated: PropTypes.string,
    files: PropTypes.array,
    location: PropTypes.object,
    lineOne: PropTypes.string,
    city: PropTypes.string,
    stateProvinceCode: PropTypes.string,
    createdBy: PropTypes.number,
  }),
  seeker: PropTypes.shape({
    userId: PropTypes.number,
  }),
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
};

export default React.memo(VenueCard);
