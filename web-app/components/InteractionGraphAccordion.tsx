import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Graph from "react-graph-vis";

interface InteractionGraphAccordionData {
  currentPostBody: string;
  shouldShow: boolean;
  setShouldShow: (boolean) => void;
}

export default function InteractionGraphAccordion(): JSX.Element {
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

  return (
    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            See a visualization of student interactions!
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>{visualization}</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
