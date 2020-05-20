import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getTag } from 'store/actions/tag';

import Notes from '../../notes/Notes';

import './tagpage.scss';

const TagPage = ({ match, tag, notes, otherNotes, getTag, loading }) => {
  const { id } = match.params;

  useEffect(() => {
    getTag(id);
    // eslint-disable-next-line
  }, [id]);

  const tagColor = {
    color: tag.color,
  };

  if (loading) {
    return <>loading</>;
  } else
    return (
      <div className="tag-page">
        <Link to={`${process.env.PUBLIC_URL}/`}>go home</Link>
        <h1 style={tagColor} className="tag-name">
          #{tag.name}
        </h1>
        <Notes notes={notes} showDelete={false} />
        {otherNotes.length > 0 && (
          <>
            <div
              className="others-line"
              style={{ background: tag.color }}
            ></div>
            <h3 className="other-tags-title">Related Notes</h3>
            <Notes notes={otherNotes} showDelete={false} />
          </>
        )}
      </div>
    );
};

console.log('proptypes');

const mapStateToProps = (state) => ({
  tag: state.tag.tag,
  notes: state.tag.notes,
  otherNotes: state.tag.otherNotes,
  loading: state.tag.loading,
});

export default connect(mapStateToProps, { getTag })(TagPage);
