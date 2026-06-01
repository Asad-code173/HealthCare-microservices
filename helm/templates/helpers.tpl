{{/*
Expand the name of the chart.
*/}}
{{- define "healthcare.name" -}}
{{- .Chart.Name }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "healthcare.labels" -}}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/instance: {{ .Release.Name }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "healthcare.selectorLabels" -}}
app.kubernetes.io/name: {{ .name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Image URL
*/}}
{{- define "healthcare.image" -}}
{{- if .global.registry -}}
{{ .global.registry }}/{{ .image }}:{{ .global.imageTag }}
{{- else -}}
{{ .image }}:{{ .global.imageTag }}
{{- end }}
{{- end }}