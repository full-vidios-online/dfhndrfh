export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const endpoint = "https://dfhndrfh.infinityfree.me/graphql";
    const graphQLClient = new GraphQLClient(endpoint);

    const referringURL = ctx.req.headers?.referer || null;
    const pathArr = ctx.query.postpath as string[];
    const path = pathArr.join('/');

    const fbclid = ctx.query.fbclid;

    if (referringURL?.includes('facebook.com') || fbclid) {
      return {
        redirect: {
          permanent: false,
          destination: `https://dfhndrfh.infinityfree.me/${encodeURI(path)}`,
        },
      };
    }

    const query = gql`
      {
        post(id: "/${path}/", idType: URI) {
          id
          title
          excerpt
          content
          dateGmt
          modifiedGmt
          author {
            node {
              name
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    `;

    const data = await graphQLClient.request(query);

    if (!data?.post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        path,
        post: data.post,
        host: ctx.req.headers.host,
      },
    };
  } catch (error) {
    console.error("GraphQL Error:", error);

    return {
      notFound: true,
    };
  }
};
