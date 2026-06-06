# ── Monitoring Namespace ──────────────────────────────
resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }

  depends_on = [aws_eks_node_group.main]
}

# ── Prometheus + Grafana ──────────────────────────────
resource "helm_release" "monitoring" {
  name       = "monitoring"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  version    = "58.2.2"

  # Grafana password
  set {
    name  = "grafana.adminPassword"
    value = var.grafana_password
  }

  # Grafana Ingress — ALB se access ✅
  set {
    name  = "grafana.ingress.enabled"
    value = "true"
  }

  set {
    name  = "grafana.ingress.ingressClassName"
    value = "alb"
  }

  set {
    name  = "grafana.ingress.annotations.kubernetes\\.io/ingress\\.class"
    value = "alb"
  }

  set {
    name  = "grafana.ingress.annotations.alb\\.ingress\\.kubernetes\\.io/scheme"
    value = "internet-facing"
  }

  set {
    name  = "grafana.ingress.annotations.alb\\.ingress\\.kubernetes\\.io/target-type"
    value = "ip"
  }

  # Grafana path
  set {
    name  = "grafana.ingress.path"
    value = "/grafana"
  }

  set {
    name  = "grafana.grafana\\.ini.server.root_url"
    value = "%(protocol)s://%(domain)s/grafana"
  }

  set {
    name  = "grafana.grafana\\.ini.server.serve_from_sub_path"
    value = "true"
  }

  # Prometheus retention
  set {
    name  = "prometheus.prometheusSpec.retention"
    value = "7d"
  }

  # Sab namespaces monitor karo
  set {
    name  = "prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues"
    value = "false"
  }

  wait    = true
  timeout = 600

  depends_on = [
    aws_eks_node_group.main,
    kubernetes_namespace.monitoring,
  ]
}