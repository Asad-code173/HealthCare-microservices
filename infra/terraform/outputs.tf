output "frontend_url" {
  description = "ALB URL — LB Controller banayega after ArgoCD sync."
  value       = "Run: kubectl get ingress -A"
}

output "ecr_repository_urls" {
  description = "ECR repositories for microservices images."
  value = {
    for key, repo in aws_ecr_repository.service : key => repo.repository_url
  }
}

output "eks_cluster_name" {
  description = "EKS cluster name."
  value       = aws_eks_cluster.main.name
}

output "eks_cluster_endpoint" {
  description = "EKS API endpoint."
  value       = aws_eks_cluster.main.endpoint
}

output "eks_cluster_ca" {
  description = "Cluster CA certificate."
  value       = aws_eks_cluster.main.certificate_authority[0].data
  sensitive   = true
}

output "postgres_endpoint" {
  description = "RDS PostgreSQL endpoint."
  value       = aws_db_instance.postgres.address
}

output "redis_endpoint" {
  description = "Redis endpoint."
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}