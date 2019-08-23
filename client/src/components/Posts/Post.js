import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../store/actions/post";
import Spinner from "../layout/spinner";
import PostItem from "./PostItem";

const Post = ({ post: { posts, loading }, getPosts }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 class="large text-primary">Posts</h1>
      <p class="lead">
        <i class="fas fa-user" /> Welcome to the community!
      </p>
        {/* POst form */}
        <div class="posts">
            {
                posts.map((post) => (
                    <PostItem key={post._id} post={post}/>
                ))
            }
        </div>
        </Fragment>
  );
};

Post.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  post: state.post
});
export default connect(
  mapStateToProps,
  { getPosts }
)(Post);
