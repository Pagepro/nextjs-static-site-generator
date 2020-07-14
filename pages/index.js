import gql from "graphql-tag"
import Link from "next/link"
import apolloClient from "../src/setup/apolloClient"

const Home = ({ projects }) => {
  return (
    <ul>
      {projects.nodes.map(({ name, description, id, fullPath }) => (
        <li key={id}>
          <p><strong>{name}</strong></p>
          {description && <span>{description}</span>}
          <div>
            <Link
              href="/project/[...fullPath]"
              as={`/project/${fullPath}`}
            >
              <a>Details</a>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}

const PROJECTS_QUERY = gql`
  query {
    projects (first: 10) {
      nodes {
        id
        name
        description
        fullPath
      }
    }
  }
`

export const getStaticProps = async () => {
  const { data } = await apolloClient.query({
    query: PROJECTS_QUERY
  })

  return {
    props: {
      projects: data.projects,
    }
  }
}

export default Home