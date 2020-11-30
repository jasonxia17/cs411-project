import Graph from "react-graph-vis";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ContentWrapper from "../../../components/ContentWrapper";

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

  // Note: We get an error when refreshing the page if we just store the
  // graph's nodes/edges object via state instead of directly storing the
  // JSX.Element graph.
  const [visualization, setVisualization] = useState(<div></div>);

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
        const raw_graph = data.graph;
        if (raw_graph.edges.length === 0 && raw_graph.nodes.length === 0) {
          setVisualization(
            <h1>Users have not interacted with each other yet.</h1>
          );
        } else {
          setVisualization(<Graph graph={data.graph} options={options} />);
        }
      })
      .catch(reason => console.log(reason));
  }, [query]);

  return <ContentWrapper>{visualization}</ContentWrapper>;
}
