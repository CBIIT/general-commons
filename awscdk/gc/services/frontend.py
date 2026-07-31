from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_secretsmanager as secretsmanager
from aws_cdk import aws_cloudwatch as cloudwatch
from datetime import date
from aws_cdk import Duration
from services.base_service import BaseService

class frontendService(BaseService):
  def createService(self, stack, config,security_group):
    
    ### Frontend Service ###############################################################################################################
    service = "frontend"

    environment={
            #"NEW_RELIC_APP_NAME":"{}-{}".format(self.namingPrefix, service),
            "NEW_RELIC_APP_NAME": f"{stack.namingPrefix}-{service}",
            "NEW_RELIC_DISTRIBUTED_TRACING_ENABLED":"true",
            "NEW_RELIC_HOST":"gov-collector.newrelic.com",
            "NEW_RELIC_LABELS":"Project:{};Environment:{}".format('gc', config['main']['tier']),
            "NEW_RELIC_NO_CONFIG_FILE":"true",
            #"NODE_LEVEL":"Study Arm(s)",
            #"NODE_LEVEL_ACCESS":"true",
            "PUBLIC_ACCESS":"Metadata Only",
            #"REACT_APP_ABOUT_CONTENT_URL":config[service]['about_content_url'],
            "REACT_APP_DATA_RELEASES_URL":config[service]['data_releases_url'],
            "REACT_APP_STATIC_CONTENT_URL":config[service]['statis_content_url'],
            "REACT_APP_INTEROP_SERVICE_API":f"{stack.app_url}/api/interoperation/",
            #"REACT_APP_AUTH_API":self.app_url,
            "REACT_APP_AUTH_SERVICE_API":f"{stack.app_url}/api/auth/",
            "REACT_APP_BACKEND_API":f"{stack.app_url}/v1/graphql/",
            "REACT_APP_BACKEND_PUBLIC_API":f"{stack.app_url}/v1/public-graphql/",
            "REACT_APP_BE_VERSION":config['backend']['image'],
            "REACT_APP_FE_VERSION":config[service]['image'],
            "REACT_APP_FILE_SERVICE_API":f"{stack.app_url}/api/files/",
            "REACT_APP_GA_TRACKING_ID":config[service]['ga_tracking_id'],
            "REACT_APP_USER_SERVICE_API":f"{stack.app_url}/api/users/",
            "REACT_APP_DMN_URL":config[service]['react_app_dmn_url'],
    }

    secrets={
            "NEW_RELIC_LICENSE_KEY":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(stack, "fe_newrelic", secret_name='monitoring/newrelic'), 'api_key'),
            #"REACT_APP_NIH_CLIENT_ID":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "fe_provider_id", secret_name='auth/provider/nih'), 'nih_client_id'),
            #"REACT_APP_NIH_AUTH_URL":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "fe_provider_url", secret_name='auth/provider/nih'), 'nih_client_url'),
            #"REACT_APP_GOOGLE_CLIENT_ID":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "fe_google", secret_name='auth/provider/google'), 'idp_client_id'),
    }

    super().createService(stack, config, security_group, service, environment, secrets)
