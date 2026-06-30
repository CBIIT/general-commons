from aws_cdk import Duration
from aws_cdk import aws_iam as iam
from aws_cdk import aws_elasticloadbalancingv2 as elbv2
from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_ecr as ecr
from aws_cdk import aws_secretsmanager as secretsmanager
from aws_cdk import aws_cloudwatch as cloudwatch
from aws_cdk import aws_ec2 as ec2
from datetime import date


class backendService:
  def createService(self, config, security_group):
      
    

    ### Backend Service ###############################################################################################################
    service = "backend"

    # Set container configs
    if config.has_option(service, 'command'):
        command = [config[service]['command']]
    else:
        command = None

    environment={
            #"NEW_RELIC_APP_NAME":"{}-{}".format(self.namingPrefix, service),
            #"NEW_RELIC_DISTRIBUTED_TRACING_ENABLED":"true",
            #"NEW_RELIC_HOST":"gov-collector.newrelic.com",
            #"NEW_RELIC_LABELS":"Project:{};Environment:{}".format('gc', config['main']['tier']),
            #"NEW_RELIC_LOG_FILE_NAME":"STDOUT",
            "MEMGRAPH_ENDPOINT": self.NLB.load_balancer_dns_name,
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
            "ES_HOST":ecs.Secret.from_secrets_manager(self.secret, 'es_host'),
            "MEMGRAPH_USER":ecs.Secret.from_secrets_manager(self.secret, 'memgraph_user'),
            "MEMGRAPH_PASSWORD":ecs.Secret.from_secrets_manager(self.secret, 'memgraph_password'),
            "SUMO_COLLECTOR_ENDPONT":ecs.Secret.from_secrets_manager(self.secret, 'sumo_collector_endpoint'),
            "SUMO_COLLECTOR_TOKEN":ecs.Secret.from_secrets_manager(self.secret, 'sumo_collector_token_backend'),
            
        }   
    
    taskDefinition = ecs.FargateTaskDefinition(self,
        "{}-{}-taskDef".format(self.namingPrefix, service),
        family=f"{config['main']['resource_prefix']}-{config['main']['tier']}-backend",
        cpu=config.getint(service, 'cpu'),
        memory_limit_mib=config.getint(service, 'memory')
    )
    
    ecr_repo = ecr.Repository.from_repository_arn(self, "{}_repo".format(service), repository_arn=config[service]['repo'])
    
    # no sumo log
    taskDefinition.add_container(
        service,
        #image=ecs.ContainerImage.from_registry("{}:{}".format(config[service]['repo'], config[service]['image'])),
        image=ecs.ContainerImage.from_ecr_repository(repository=ecr_repo, tag=config[service]['image']),
        cpu=config.getint(service, 'cpu'),
        memory_limit_mib=config.getint(service, 'memory'),
        port_mappings=[ecs.PortMapping(app_protocol=ecs.AppProtocol.http, container_port=config.getint(service, 'port'), name=service)],
        command=command,
        environment=environment,
        secrets=secrets,
        logging=ecs.LogDrivers.aws_logs(
            stream_prefix="{}-{}".format(self.namingPrefix, service)
        )
    )

    # use sumo log
    #taskDefinition.add_container(
        #service,
        ##image=ecs.ContainerImage.from_registry("{}:{}".format(config[service]['repo'], config[service]['image'])),
        #image=ecs.ContainerImage.from_ecr_repository(repository=ecr_repo, tag=config[service]['image']),
        #cpu=config.getint(service, 'cpu'),
        #memory_limit_mib=config.getint(service, 'memory'),
        #port_mappings=[ecs.PortMapping(app_protocol=ecs.AppProtocol.http, container_port=config.getint(service, 'port'), name=service)],
        #command=command,
        #environment=environment,
        #secrets=secrets,
        #logging=ecs.LogDrivers.firelens(
            #options={
                #"Name": "http",
                #"Host": config['secrets']['sumo_collector_endpoint'],
                #"URI": "/receiver/v1/http/{}".format(config['secrets']['sumo_collector_token_backend']),
                #"Port": "443",
                #"tls": "on",
                #"tls.verify": "off",
                #"Retry_Limit": "2",
                #"Format": "json_lines"
            #}    
        #)
    #)

    # Sumo Logic FireLens Log Router Container
    #sumo_logic_container = taskDefinition.add_firelens_log_router(
        #"sumologic-firelens",
        #image=ecs.ContainerImage.from_registry("public.ecr.aws/aws-observability/aws-for-fluent-bit:stable"),
        #firelens_config=ecs.FirelensConfig(
            #type=ecs.FirelensLogRouterType.FLUENTBIT,
            #options=ecs.FirelensOptions(
                #enable_ecs_log_metadata=True
            #)
        #),
    #essential=True
    #)

    # additional permission to attach to the task role
    # cluster exec
    cluster_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "ecs:ExecuteCommand"
        ],
        resources=[
            #f"arn:aws:ecs:{config['main']['region']}:{config['main']['account_id']}:cluster/{config['main']['resource_prefix']}-{config['main']['tier']}-ecs"
            f"arn:aws:ecs:{config['main']['region']}:{config['main']['account_id']}:cluster/*"
        ]
    ) 

    # ecr access
    ecr_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "ecr:UploadLayerPart",
            "ecr:PutImage",
            "ecr:BatchCheckLayerAvailability",
            "ecr:BatchGetImage",
            "ecr:CompleteLayerUpload",
            "ecr:DescribeRepositories",
            "ecr:GetDownloadUrlForLayer",
            "ecr:GetLifecyclePolicy",
            "ecr:GetRepositoryPolicy",
            "ecr:InitiateLayerUpload",
            "ecr:ListTagsForResource"
        ],
        resources=["arn:aws:ecr:us-east-1:986019062625:repository/*"]
    )

    # logs & extra
    log_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "ecr:GetAuthorizationToken",
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "ssmmessages:CreateControlChannel",
            "ssmmessages:CreateDataChannel",
            "ssmmessages:OpenControlChannel",
            "ssmmessages:OpenDataChannel"
        ],
        resources=["*"]
    )
    
    log2_policy = iam.PolicyStatement(
         effect=iam.Effect.ALLOW,
        actions=[
            "logs:PutLogEvents"
        ],
        resources=[f"arn:aws:logs:*:{config['main']['account_id']}:log-group:*:log-stream:*"]
    )

    kms_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "kms:Decrypt",
            "kms:GenerateDataKey"
        ],
        resources=[f"arn:aws:kms:{config['main']['region']}:{config['main']['account_id']}:key/*"]
    )
    
    secret_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "secretsmanager:DescribeSecret",
            "secretsmanager:GetResourcePolicy",
            "secretsmanager:GetSecretValue",
            "secretsmanager:ListSecretVersionIds",
            "secretsmanager:ListSecrets"
        ],
        resources=[f"arn:aws:secretsmanager:{config['main']['region']}:{config['main']['account_id']}:secret/*"]
    )    

    opensearch_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "es:ESHttp*"
        ],
        resources=[f"arn:aws:es:*:{config['main']['account_id']}:domain/*"]
    )

    bucket_name=config["cloudfront"]["bucket_name"]    

    bucket_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "s3:ListBucket",
            "s3:DeleteObject",
            "s3:GetObject",
            "s3:PutObject"
        ],
        resources=[
            f"arn:aws:s3:::{bucket_name}",
            f"arn:aws:s3:::{bucket_name}/*"
        ]
    )

    efs_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "elasticfilesystem:DescribeFileSystems",
            "elasticfilesystem:DescribeMountTargets"
        ],
        resources=["*"]
    )

    efs2_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "elasticfilesystem:ClientMount",
            "elasticfilesystem:ClientRootAccess",
            "elasticfilesystem:ClientWrite"
        ],
        resources=["arn:aws:elasticfilesystem:*:*:file-system/*"]
    )

    sqs_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "sqs:*"
        ],
        resources=[f"arn:aws:sqs:{config['main']['region']}:{config['main']['account_id']}:*"]
    )
    #attach policies to task role
    taskDefinition.task_role.add_to_policy(cluster_policy)
    taskDefinition.task_role.add_to_policy(ecr_policy)
    taskDefinition.task_role.add_to_policy(log_policy)
    taskDefinition.task_role.add_to_policy(log2_policy)
    taskDefinition.task_role.add_to_policy(kms_policy)
    taskDefinition.task_role.add_to_policy(secret_policy)
    taskDefinition.task_role.add_to_policy(opensearch_policy)
    taskDefinition.task_role.add_to_policy(bucket_policy)
    taskDefinition.task_role.add_to_policy(efs_policy)
    taskDefinition.task_role.add_to_policy(efs2_policy)
    taskDefinition.task_role.add_to_policy(sqs_policy)

    taskDefinition.execution_role.add_to_policy(cluster_policy)
    taskDefinition.execution_role.add_to_policy(ecr_policy)
    taskDefinition.execution_role.add_to_policy(log_policy)
    taskDefinition.execution_role.add_to_policy(log2_policy)
    taskDefinition.execution_role.add_to_policy(kms_policy)
    taskDefinition.execution_role.add_to_policy(secret_policy)
    taskDefinition.execution_role.add_to_policy(opensearch_policy)
    taskDefinition.execution_role.add_to_policy(bucket_policy)
    taskDefinition.execution_role.add_to_policy(efs_policy)
    taskDefinition.execution_role.add_to_policy(efs2_policy)    
    taskDefinition.execution_role.add_to_policy(sqs_policy)    

    # get subnet for the ecs service
    #subnet_be1 = config.get(service, 'subnet_be1')
    #subnet_be2 = config.get(service, 'subnet_be2')
    #subnets_be = ec2.SubnetSelection(
        #subnets=[
          #ec2.Subnet.from_subnet_id(self, "Subnet_be1", subnet_be1),
          #ec2.Subnet.from_subnet_id(self, "Subnet_be2", subnet_be2)
        #]
    #)
    ecsService = ecs.FargateService(self,
        "{}-{}-service".format(self.namingPrefix, service),
        service_name=f"{config['main']['resource_prefix']}-{config['main']['tier']}-backend",
        cluster=self.ECSCluster,
        task_definition=taskDefinition,
        enable_execute_command=True,
        min_healthy_percent=50,
        max_healthy_percent=200,
        circuit_breaker=ecs.DeploymentCircuitBreaker(
            enable=True,
            rollback=True
        ),
        #vpc_subnets=subnets_be,
        vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS),
        security_groups=security_group
    )

    ecsTarget = self.listener.add_targets("ECS-{}-Target".format(service),
        port=int(config[service]['port']),
        protocol=elbv2.ApplicationProtocol.HTTP,
        target_group_name=f"{config['main']['resource_prefix']}-{config['main']['tier']}-backend",
        health_check = elbv2.HealthCheck(
            path=config[service]['health_check_path'],
            timeout=Duration.seconds(config.getint(service, 'health_check_timeout')),
            interval=Duration.seconds(config.getint(service, 'health_check_interval')),),
        targets=[ecsService],)

    elbv2.ApplicationListenerRule(self, id="alb-{}-rule".format(service),
        conditions=[
            elbv2.ListenerCondition.path_patterns(config[service]['path'].split(','))
        ],
        priority=int(config[service]['priority_rule_number']),
        listener=self.listener,
        target_groups=[ecsTarget])
