from aws_cdk import aws_elasticloadbalancingv2 as elbv2
from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_ecr as ecr
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_secretsmanager as secretsmanager
from aws_cdk import aws_iam as iam
from datetime import date
from aws_cdk import Duration
from aws_cdk import aws_cloudwatch as cloudwatch

class memgraphService:
  def createService(self, config):

    ### Memgraph Service ###############################################################################################################
    service = "memgraph"

    # Set container configs
    if config.has_option(service, 'entry_point'):
        entry_point = ["/bin/sh", "-c", config[service]['entry_point']]
    else:
        entry_point = None

    environment={
        #"MEMGRAPH_USER":'\'{}'''.format(config['db']['db_user']),
        #"MEMGRAPH_PASSWORD":'\'{}\''.format(config['db']['db_pass']),
        "MEMGRAPH_USER":config['db']['memgraph_user'],
        "MEMGRAPH_PASSWORD":config['db']['memgraph_password'],
        "MEMGRAPH":"--also-log-to-stderr=true --log-level=INFO",
        "VERSION":config[service]['image'],
        "DATE":date.today().isoformat(),
        "PROJECT":"gen",
        
    }

    #secrets={
        #"MEMGRAPH_USER":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "memgraph_user", secret_name='bento/gen/dev'), 'memgraph_user'),
        #"MEMGRAPH_PASSWORD":ecs.Secret.from_secrets_manager(secretsmanager.Secret.from_secret_name_v2(self, "memgraph_password", secret_name='bento/gen/dev'), 'memgraph_password'),
        #"MEMGRAPH_USER":ecs.Secret.from_secrets_manager(self.secret, 'memgraph_user'),
        #"MEMGRAPH_PASSWORD":ecs.Secret.from_secrets_manager(self.secret, 'memgraph_password'),
    #}

    dbVolume = ecs.Volume(
        name="memgraph",
        efs_volume_configuration=ecs.EfsVolumeConfiguration(
            file_system_id=self.fileSystem.file_system_id,
            authorization_config=ecs.AuthorizationConfig(
                access_point_id=self.EFSAccessPoint.access_point_id,
                iam="ENABLED"
            ),
            transit_encryption="ENABLED"
        )
    )

    taskDefinition = ecs.FargateTaskDefinition(self,
        "{}-{}-taskDef".format(self.namingPrefix, service),
        cpu=config.getint(service, 'cpu'),
        memory_limit_mib=config.getint(service, 'memory'),
        family=f"{config['main']['resource_prefix']}-{config['main']['tier']}-memgraph",
        volumes=[dbVolume]
    )

    # ecr_repo = ecr.Repository.from_repository_arn(self, "{}_repo".format(service), repository_arn=config[service]['repo'])
    ecr_repo = ecr.Repository.from_repository_arn(self, "{}_repo".format(service), repository_arn=config[service]['repo'])

    dbContainer = taskDefinition.add_container(
        service,
        #image=ecs.ContainerImage.from_registry(config[service]['image']),
        #image=ecs.ContainerImage.from_registry("{}:{}".format(config[service]['repo'], config[service]['image'])),
        image=ecs.ContainerImage.from_ecr_repository(repository=ecr_repo, tag=config[service]['image']),
        cpu=config.getint(service, 'cpu'),
        memory_limit_mib=config.getint(service, 'memory'),
        port_mappings=[ecs.PortMapping(container_port=config.getint(service, 'port'), name=service), ecs.PortMapping(container_port=7444, name="mg-7444")],
        user="root",
        entry_point=entry_point,
        #secrets=secrets,
        environment=environment,
        logging=ecs.LogDrivers.aws_logs(
            stream_prefix="{}-{}".format(self.namingPrefix, service)
        )
    )
    containerVolumeMountPoint = ecs.MountPoint(
        read_only=False,
        container_path="{}".format(config[service]['data_directory']),
        source_volume=dbVolume.name
    )
    dbContainer.add_mount_points(containerVolumeMountPoint)
    self.fileSystem.grant_root_access(taskDefinition.task_role)

    # additional permission to attach to the task role
    # cluster exec
    cluster_policy = iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=[
            "ecs:ExecuteCommand"
        ],
        resources=[
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

    # Extract DB subnet IDs
    #subnet_db1 = config.get(service, 'subnet_db1')
    #subnet_db2 = config.get(service, 'subnet_db2')
    #subnets_db = ec2.SubnetSelection(
        #subnets=[
            #ec2.Subnet.from_subnet_id(self, "Subnet_db1", subnet_db1),
            #ec2.Subnet.from_subnet_id(self, "Subnet_db2", subnet_db2)
        #]
    #)
    ecsService = ecs.FargateService(self,
        "{}-{}-service".format(self.namingPrefix, service),
        service_name=f"{config['main']['resource_prefix']}-{config['main']['tier']}-memgraph",
        cluster=self.ECSCluster,
        task_definition=taskDefinition,
        enable_execute_command=True,
        min_healthy_percent=0,
        max_healthy_percent=100,
        circuit_breaker=ecs.DeploymentCircuitBreaker(
            enable=True,
            rollback=True
        ),
        #vpc_subnets=subnets_db
        vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_ISOLATED),
    )

    ### NLB - Memgraph
    #if config.getboolean('nlb', 'internet_facing'):
        #subnets=ec2.SubnetSelection(
            #subnets=self.VPC.select_subnets(one_per_az=True,subnet_type=ec2.SubnetType.PUBLIC).subnets
        #)
    #else:
        #subnets=ec2.SubnetSelection(
            #subnets=self.VPC.select_subnets(one_per_az=True,subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS).subnets
        #)

    # Extract subnet IDs
    #subnet_nlb1 = config.get('Subnets', 'subnet_nlb1')
    #subnet_nlb2 = config.get('Subnets', 'subnet_nlb2')
    #subnets_nlb = ec2.SubnetSelection(
        #subnets=[
            #ec2.Subnet.from_subnet_id(self, "Subnet_nlb1", subnet_nlb1),
            #ec2.Subnet.from_subnet_id(self, "Subnet_nlb2", subnet_nlb2)
        #]
    #)

    self.NLB = elbv2.NetworkLoadBalancer(self,
        "nlb",
        vpc=self.VPC,
        internet_facing=config.getboolean('nlb', 'internet_facing'),
        #vpc_subnets=subnets,
        #vpc_subnets=subnets_nlb,
        vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PUBLIC),
        load_balancer_name=f"{config['main']['resource_prefix']}-{config['main']['tier']}-nlb",
    )

    # Create Security group for NLB
    # read CIDRs and port from config.ini
    restricted_cidrs = config.get(service, 'allowed_nlb_cidrs').split(',')

    NLBSecurityGroup = ec2.SecurityGroup(self, "NLBSecurityGroup", vpc=self.VPC, allow_all_outbound=True, security_group_name=f"{config['main']['resource_prefix']}-{config['main']['tier']}-nlb-sg",)
    
    # add ingress rules for each CIDR
    for cidr in restricted_cidrs:
        NLBSecurityGroup.add_ingress_rule(peer=ec2.Peer.ipv4(cidr.strip()),
            connection=ec2.Port.tcp(config.getint(service, 'port')),
        )
        NLBSecurityGroup.add_ingress_rule(peer=ec2.Peer.ipv4(cidr.strip()),
            connection=ec2.Port.tcp(7444),
        )

    # Attach SG to NLB
    self.NLB.add_security_group(NLBSecurityGroup)

    # Allow ECS service to accept traffic from the NLB
    ecsService.connections.security_groups[0].add_ingress_rule(
        NLBSecurityGroup,
        ec2.Port.tcp(config.getint(service, 'port'))
    )
    ecsService.connections.security_groups[0].add_ingress_rule(
        NLBSecurityGroup,
        ec2.Port.tcp(7444)
    )
    #NLBSecurityGroup.add_ingress_rule(peer=ec2.Peer.ipv4("128.231.0.0/16"),
        #connection=ec2.Port.tcp(config.getint(service, 'port')),
    #)
    #NLBSecurityGroup.add_ingress_rule(peer=ec2.Peer.ipv4("10.0.0.0/8"),
        #connection=ec2.Port.tcp(config.getint(service, 'port')),
    #)
    self.mgECSService = ecsService

    nlbTargetGroup = elbv2.NetworkTargetGroup(self,
        id="nlbTargetGroup",
        target_type=elbv2.TargetType.IP,
        protocol=elbv2.Protocol.TCP,
        port=config.getint(service, 'port'),
        target_group_name=f"{config['main']['resource_prefix']}-{config['main']['tier']}-memgraph",
        vpc=self.VPC
    )
    nlbListener = self.NLB.add_listener("Listener", port=config.getint(service, 'port'),)
    nlbListener.add_target_groups("target", nlbTargetGroup)
    nlbTargetGroup.add_target(ecsService)

    mg7444TargetGroup = elbv2.NetworkTargetGroup(self,
        id="mg7444TargetGroup",
        target_type=elbv2.TargetType.IP,
        protocol=elbv2.Protocol.TCP,
        port=7444,
        target_group_name=f"{config['main']['resource_prefix']}-{config['main']['tier']}-memgraph-7444",
        vpc=self.VPC
    )
    mg7444Listener = self.NLB.add_listener("MG7444Listener", port=7444,)
    mg7444Listener.add_target_groups("mg7444target", mg7444TargetGroup)
    mg7444TargetGroup.add_target(
        ecsService.load_balancer_target(
            container_name=service,
            container_port=7444,
        )
    )
