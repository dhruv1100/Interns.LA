import React from "react";
import _logger from "sabio-debug";
import * as venueService from "../../services/venueService";
import VenueTemplate from "./VenueCard";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import Search from "../../components/utility/Search";
import "./Venue.css";
import swal from "sweetalert";

class Venue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: [],
      search: "",
      mappedVenue: [],
      isSearching: false,
      pagination: {
        current: 1,
        totalCount: 0,
        pageSize: 9,
      },
    };
  }

  componentDidMount() {
    this.getPaginate(
      this.state.pagination.current - 1,
      this.state.pagination.pageSize
    );
  }

  getPaginate = (pageIndex, pageSize) => {
    venueService
      .paginate(pageIndex, pageSize)
      .then(this.getAllSuccess)
      .catch(this.getAllError);
  };

  getAllSuccess = (res) => {
    const venues = res.item.pagedItems;
    const mappedVenue = venues.map(this.mapVenue);
    let pagination = {
      current: res.item.pageIndex + 1,
      totalCount: res.item.totalCount,
      pageSize: 9,
    };
    this.setState((prevState) => {
      return {
        ...prevState,
        venues,
        mappedVenue,
        pagination,
      };
    });
  };

  getAllError = () => {
    _logger("Error On GETAll...");
    this.resetState();
  };

  resetState = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        venues: [],
        mappedVenue: [],
        pagination: {
          current: 1,
          totalCount: 0,
          pageSize: 9,
        },
      };
    });
  };

  mapVenue = (venue) => (
    <VenueTemplate
      role={this.props.currentUser.roles[0]}
      venue={venue}
      key={venue.id}
      handleDelete={this.handleDelete}
      handleEdit={this.handleEdit}
      userId={this.props.currentUser.id}
    />
  );

  handleDelete = (id) => {
    this.deleteVenue(id);
  };

  deleteVenue = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Venue!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        venueService
          .deleteById(id)
          .then(this.deleteSuccess)
          .catch(this.deleteError);
        swal("Poof! Your Venue has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your Venue is safe!");
      }
    });
    _logger(id);
  };

  deleteSuccess = () => {
    _logger("Delete Success");
    const page = this.state.pagination;
    this.getPaginate(page.current - 1, page.pageSize);
  };

  deleteError = () => {
    _logger("Delete Error");
  };

  handleEdit = (venue) => {
    _logger(venue.id);
    _logger("LoacationId", venue.locationId);
    this.props.history.push(`/venue/${venue.id}/edit`, venue);
  };

  AddNewVenue = () => {
    _logger("add click");
    this.props.history.push("/venue/new");
  };

  handleSearch = (e) => {
    this.setState((preState) => {
      return { ...preState, search: e };
    });
    const data = e;
    const page = this.state.pagination;
    this.handleSearching(data, page.current, page.pageSize);
  };

  handleSearching = (data, pageIndex, pageSize) => {
    venueService
      .search(data, pageIndex - 1, pageSize)
      .then(this.searchSuccess)
      .catch(this.searchError);
  };
  searchSuccess = (res) => {
    _logger("searchSuccess");
    this.getAllSuccess(res);
  };

  onNextPage = (page) => {
    _logger(page);
    if (this.state.search && this.state.search.length > 0) {
      this.handleSearching(
        this.state.search,
        page,
        this.state.pagination.pageSize
      );
    } else {
      this.setState(
        (prevState) => {
          return {
            ...prevState,
            pagination: {
              ...prevState.pagination,
              current: page - 1,
            },
          };
        },
        () => this.getPaginate(page - 1, this.state.pagination.pageSize)
      );
    }
  };

  searchError = () => {
    _logger("searchError");
    this.resetState();
  };

  resetSearch = () => {
    this.setState({ search: "", isSearching: false }, () =>
      this.getPaginate(0, this.state.pagination.pageSize)
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="container-fuild  ml-2">
          <div className="row mainpage">
            <div className="col-4 mt-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.AddNewVenue}
              >
                New Venue
              </button>
            </div>
            <div className="col-md-3 mt-2 ml-auto">
              <Search
                getAllPaginated={this.getPaginate}
                searchBtnClick={this.handleSearch}
                updateSearchQuery={this.resetSearch}
                searchQuery={this.state.search}
                isSearching={this.state.isSearching}
              ></Search>
            </div>
          </div>
          <div className="row ml-1 mr-1 mt-2">
            {this.state.mappedVenue.length > 0 ? (
              <>{this.state.mappedVenue}</>
            ) : (
              <h1> No Records Found...</h1>
            )}
          </div>
          <div className="text-center pagination">
            <Pagination
              onChange={this.onNextPage}
              current={this.state.pagination.current}
              pageSize={this.state.pagination.pageSize}
              total={this.state.pagination.totalCount}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Venue.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default Venue;
