import { Box } from '@chakra-ui/react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<{
  spec: any;
}>(import('swagger-ui-react'), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
  <Box bg="white" h="100%" minH="100vh">
  <SwaggerUI spec={spec} />
  </Box>);
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Next Swagger API Example',
        version: '1.0',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
         
          OAuth2: {
            type: 'oauth2',
            flows: {
              authorizationCode: {
                authorizationUrl: 'https://example.com/oauth/authorize',
                tokenUrl: 'https://example.com/oauth/token',
                scopes: {
                  read: 'Grants read access',
                  write: 'Grants write access',
                },
              },
            },
          },

        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
    apiFolder: 'src/pages/api',
    schemaFolders: [
      "src/models"
    ],
   
  });

  return {
    props: {
      spec,
    },
  };
};

ApiDoc.doc=true;
export default ApiDoc;