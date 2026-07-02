from aws_cdk import aws_ecs as ecs
from datetime import date
from aws_cdk import Duration
from aws_cdk import aws_cloudwatch as cloudwatch
from aws_cdk import aws_secretsmanager as secretsmanager
from aws_cdk import aws_cloudfront as cloudfront
from aws_cdk import aws_cloudfront_origins as origins
from services.base_service import BaseService

class interoperationService(BaseService):
  def createService(self, stack, config, security_group):

    ### Files Service ###############################################################################################################
    service = "interoperation"

    environment={
            #"NEW_RELIC_APP_NAME":config[service]['new_relic_app_name'],
            #"BENTO_BACKEND_GRAPHQL_URI":f"{self.app_url}/v1/graphql/",
            "DATE":date.today().isoformat(),
            #"REDIS_PORT":"6001",
            #"REDIS_HOST":"localhost",
            "PROJECT":"gen",
            #"URL_SRC":"CLOUD_FRONT",
            "VERSION":config[service]['image'],
            "SIGNED_URL_EXPIRY_SECONDS":config[service]['exp_seconds'],
            "FILE_MANIFEST_BUCKET_NAME":config["cloudfront"]["bucket_name"],
            #"S3_SECRET_ACCESS_KEY":config[service]['s3_secret_access_key'],
            #"S3_ACCESS_KEY_ID":config[service]['s3_access_key_id'],
    
    }

    secrets={
            #"NEW_RELIC_LICENSE_KEY":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "inter_newrelic", secret_name='monitoring/newrelic'), 'api_key'),
            #"CLOUDFRONT_PRIVATE_KEY":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "privatekey", secret_name="bento/gen/cloudfront"), 'privatekey_pem'),
            "CLOUDFRONT_PRIVATE_KEY":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(stack, "privatekey", secret_name="gen/cloudfront")),
            #"CLOUDFRONT_KEY_PAIR_ID":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "key_group_id", secret_name='bento/gen/cloudfront'), 'key_group_id'),
            "CLOUDFRONT_KEY_PAIR_ID":ecs.Secret.from_secrets_manager(stack.secret, 'cf_key_pair_id'),
            #"CLOUDFRONT_DOMAIN":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(stack, "domain_name", secret_name='bento/gen/cloudfront'), 'domain_name'),
            "CLOUDFRONT_DOMAIN":ecs.Secret.from_secrets_manager(stack.secret, 'cf_url'),
    }
    
    super().createService(stack, config, security_group, service, environment, secrets)     
