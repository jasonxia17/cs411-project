import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.GRAPHENEDB_BOLT_URL,
  neo4j.auth.basic(
    process.env.GRAPHENEDB_BOLT_USER,
    process.env.GRAPHENEDB_BOLT_PASSWORD
  ),
  { encrypted: "ENCRYPTION_ON" }
);

export default driver;
