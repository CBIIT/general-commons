from aws_cdk import Duration
from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_secretsmanager as secretsmanager
from aws_cdk import aws_cloudwatch as cloudwatch
from datetime import date
from services.base_service import BaseService


class backendService(BaseService):
  def createService(self, stack, config, security_group):
      
    ### Backend Service ###############################################################################################################
    service = "backend"

    environment={
            #"NEW_RELIC_APP_NAME":"{}-{}".format(self.namingPrefix, service),
            #"NEW_RELIC_DISTRIBUTED_TRACING_ENABLED":"true",
            #"NEW_RELIC_HOST":"gov-collector.newrelic.com",
            #"NEW_RELIC_LABELS":"Project:{};Environment:{}".format('gc', config['main']['tier']),
            #"NEW_RELIC_LOG_FILE_NAME":"STDOUT",
            "MEMGRAPH_ENDPOINT": stack.NLB.load_balancer_dns_name,
            "MEMGRAPH_PORT":"7687",
            "ES_PORT":"443",
            "ES_SCHEME":"https",
            "ES_SIGN_REQUESTS":"true",
            "ES_SERVICE_NAME":"es",
            "ES_REGION":"us-east-1",
            #"JAVA_OPTS": "-javaagent:/usr/local/tomcat/newrelic/newrelic.jar",
            #"AUTH_ENABLED":"false",
            #"AUTH_ENDPOINT":"{}/api/auth/".format(self.app_url),
            #"AUTH_ENDPOINT":f"{self.app_url}/api/auth",
            "BENTO_API_VERSION":config[service]['image'],
            #"MYSQL_SESSION_ENABLED":"true",
            #"NEO4J_URL":"bolt://{}:7687".format(config['db']['neo4j_ip']),
            #"REDIS_ENABLE":"false",
            #"REDIS_FILTER_ENABLE":"false",
            #"REDIS_HOST":"localhost",
            #"REDIS_PORT":"6379",
            #"REDIS_USE_CLUSTER":"true",
    }

    secrets={
            #"NEW_RELIC_LICENSE_KEY":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "be_newrelic", secret_name='monitoring/newrelic'), 'api_key'),
            #"NEO4J_PASSWORD":ecs.Secret.from_secrets_manager(self.secret, 'neo4j_password'),
            #"NEO4J_USER":ecs.Secret.from_secrets_manager(self.secret, 'neo4j_user'),
            "ES_HOST":ecs.Secret.from_secrets_manager(stack.secret, 'es_host'),
            "MEMGRAPH_USER":ecs.Secret.from_secrets_manager(stack.secret, 'memgraph_user'),
            "MEMGRAPH_PASSWORD":ecs.Secret.from_secrets_manager(stack.secret, 'memgraph_password'),
            "SUMO_COLLECTOR_ENDPONT":ecs.Secret.from_secrets_manager(stack.secret, 'sumo_collector_endpoint'),
            "SUMO_COLLECTOR_TOKEN":ecs.Secret.from_secrets_manager(stack.secret, 'sumo_collector_token_backend'),
    }   

    super().createService(stack, config, security_group, service, environment, secrets)
