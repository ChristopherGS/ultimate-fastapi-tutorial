import React, {useState} from "react";
import Idea from "../Idea";

const IdeaTable = ({ideas}) => {

    return (
      <>
        <div className="sections-list">
          {ideas.length && (
              ideas.map((idea, i) => (
                <Idea key={i} idea={idea} />
              ))
          )}
          {!ideas.length && (
              <p>No Ideas found!</p>
          )}
        </div>
      </>
    )
}

export default IdeaTable;