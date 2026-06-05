
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnets"   
  subnet_ids = aws_subnet.private[*].id     

  tags = merge(local.common_tags, {
  Name = "${var.project_name}-db-subnets"
})
}

resource "aws_db_instance" "postgres" {
  identifier             = "${var.project_name}-postgres"
  allocated_storage      = 20
  max_allocated_storage  = 100
  engine                 = "postgres"
  engine_version         = "15.4"                 
  instance_class         = var.db_instance_class 
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  storage_type           = "gp3"
  skip_final_snapshot    = false
  deletion_protection    = true
  publicly_accessible    = false
  backup_retention_period = 7
  final_snapshot_identifier = "${var.project_name}-postgres-final"


  tags = merge(local.common_tags, {
    Name = "${var.project_name}-postgres"
  })
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-cache-subnets"
  subnet_ids = aws_subnet.private[*].id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-cache-subnets"
  })
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${var.project_name}-redis"
  engine               = "redis"
  node_type            = var.redis_node_type      
  num_cache_nodes      = 1
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
  parameter_group_name = "default.redis7"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-redis"
  })
}