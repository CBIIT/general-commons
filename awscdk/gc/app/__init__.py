import aws_cdk as cdk
from aws_cdk import aws_iam as iam

from app.aspects import MyAspect
from app.stack import Stack


def build_stack(app, config, synthesizer=None):
  """Build and configure the CDK stack from a ConfigParser config.

  Used by both app.py and unit tests. Pass synthesizer=None for tests so the
  default synthesizer is used.
  """
  app.node.set_context("@aws-cdk/core:stackRelativeExports", "true")

  kwargs = dict(
    stack_name="{}-{}".format(config['main']['resource_prefix'], config['main']['tier']),
    env=cdk.Environment(
      account=config['main']['account_id'],
      region=config['main']['region']
    ),
  )
  if synthesizer is not None:
    kwargs['synthesizer'] = synthesizer

  stack = Stack(app, **kwargs)

  # Rename all roles to add role prefix
  cdk.Aspects.of(stack).add(MyAspect())

  # Set permission boundary on all roles
  if config.has_option('iam', 'permission_boundary'):
    boundary = iam.ManagedPolicy.from_managed_policy_arn(stack, "Boundary", config['iam']['permission_boundary'])
    iam.PermissionsBoundary.of(stack).apply(boundary)

  config_tags = dict(s.split(':') for s in config['main']['tags'].split(","))
  env_tags = {'Environment': config['main']['tier']}
  tags = config_tags | env_tags

  for tag, value in tags.items():
    cdk.Tags.of(stack).add(tag, value)

  return stack
