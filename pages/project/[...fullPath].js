import gql from "graphql-tag";
import apolloClient from "../../src/setup/apolloClient";

const ProjectDetailsPage = ({ project }) => {
  const {
    name,
    descriptionHtml,
    repository: {
      tree
    }
  } = project
  const { lastCommit } = tree || {}
  const { sha } = lastCommit || {}

  return (
    <div>
      <h1>{name}</h1>
      <p dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
      {sha && <p>Last commit SHA: {sha}</p>}
    </div>
  )
}

export default ProjectDetailsPage;

const PROJECTS_QUERY = gql`
  query {
    projects(first: 10) {
      nodes {
        fullPath
      }
    }
  }
`

const PROJECT_DETAILS_QUERY = gql`
  query ($fullPath: ID!) {
    project(fullPath: $fullPath) {
      name
      descriptionHtml
      repository {
        empty
        tree {
          lastCommit {
            sha
          }
        }
      }
    }
  }
`

export const getStaticPaths = async () => {
  const { data } = await apolloClient.query({
    query: PROJECTS_QUERY,
  })

  return {
    paths: data.projects.nodes.map(({ fullPath }) => ({
      params: { fullPath: fullPath.split('/') },
    })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const fullPath = params.fullPath.join('/');
  const { data } = await apolloClient.query({
    query: PROJECT_DETAILS_QUERY,
    variables: {
      fullPath
    }
  })

  return {
    props: {
      project: data.project
    }
  }
}
