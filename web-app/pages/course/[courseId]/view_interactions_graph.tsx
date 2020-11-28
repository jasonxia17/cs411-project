import Graph from "react-graph-vis";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export default function ViewInteractionsPage(): JSX.Element {
  // Derived from https://github.com/crubier/react-graph-vis
  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    },
    height: "400px"
  };

  const { query } = useRouter();
  const [graph, setGraph] = useState(<div></div>);

  useEffect(() => {
    const courseId = query.courseId as string;
    if (courseId == undefined) {
      return;
    }

    fetch(`/api/course/${courseId}/view_interactions_graph?`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setGraph(<Graph graph={data.graph} options={options} />);
      })
      .catch(reason => console.log(reason));
  }, [query]);

  return <div>{graph}</div>;
}
