
resource "aws_ecr_repository" "service" {
  for_each = toset(local.service_names)

  name                 = "${var.project_name}-${each.key}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${each.key}"
  })
}


resource "aws_cloudwatch_log_group" "service" {
  for_each = toset(local.service_names)

  name              = "/eks/${var.project_name}/${each.key}"
  retention_in_days = 14

  tags = local.common_tags
}

