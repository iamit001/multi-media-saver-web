# 🎬 MultimediaSaver-Web

**MultimediaSaver-Web** is a web application designed to identify and download multimedia content such as videos and images from webpages.

This project also demonstrates an **end-to-end DevSecOps implementation**, covering source-code management, continuous integration, security scanning, containerization, and GitOps-based deployment to a Kubernetes cluster.

The CI/CD workflow is built using **GitHub, Jenkins, Docker, OWASP Dependency-Check, SonarQube, Trivy, Ansible Vault, Argo CD, and Kubernetes**.

The goal of this project is to demonstrate how an application can be **securely built, validated, containerized, and deployed automatically** using modern DevSecOps practices.
![MultimediaSaver-Web Homepage](./assets/homepage.png)

## 🛠️ Technology Stack

The following tools and technologies are used to build, secure, containerize, and deploy **MultimediaSaver-Web**.

| Technology / Tool             | Purpose                                                       |
| ----------------------------- | ------------------------------------------------------------- |
| 🐙 **GitHub**                 | Source Code Management and Git repository hosting             |
| 🔵 **Jenkins**                | Continuous Integration (CI) and pipeline automation           |
| 🐳 **Docker**                 | Application containerization and image creation               |
| 🔍 **OWASP Dependency-Check** | Scans project dependencies for known security vulnerabilities |
| 📊 **SonarQube**              | Static code analysis and code quality checks                  |
| 🛡️ **Trivy**                 | Filesystem and Docker image vulnerability scanning            |
| 🔐 **Hashicorp Vault**          | Encryption and secure management of sensitive data            |
| 🟢 **Argo CD**                | Continuous Deployment (CD) using GitOps                       |
| ☸️ **Kubernetes**             | Container orchestration and application deployment            |
| 📦 **Container Registry**     | Stores and manages Docker container images                    |



How pipeline will look after deployment:
- CI pipeline to build and push
<Jenkins CI Screenshot>

- CD pipeline to update application version
<Jenkins CD Screenshot>

- ArgoCD application for deployment on K8s
<Argocd cluster Screenshot>

Discord Pipeline Update Notification
<Discord notification screenshot>


# 🏗️ Project Implementation

This project implements an end-to-end CI/CD pipeline with security and code-quality checks integrated into the build process.
The overall workflow is:

1. 👨‍💻 Developer pushes code to GitHub.
2. 🔔 GitHub Webhook triggers the Jenkins pipeline.
3. 🔵 Jenkins performs Continuous Integration (CI) by building, scanning, and validating the application.
4. 🐳 Jenkins builds the Docker image and pushes it to a container registry after successful validation.
5. 🟢 Argo CD performs Continuous Deployment (CD) using a GitOps-based approach.
6. ☸️ Argo CD synchronizes the desired state with the Kubernetes cluster.

# 🔵 Continuous Integration — Jenkins

Jenkins is responsible for automating the CI process, including application validation, security scanning, Docker image creation, and publishing the image to a container registry.

## 🔄 CI Pipeline Stages
### 1. 📥 Checkout

Jenkins pulls the latest source code from the GitHub repository.

### 2. 🔍 Dependency Scan

OWASP Dependency-Check scans project dependencies for publicly known security vulnerabilities.

### 3. 📊 Code Quality Analysis

SonarQube analyzes the source code for:

- Bugs
- Vulnerabilities
- Code smells
- Maintainability issues
- Code quality problems
### 4. 🛡️ Filesystem Security Scan

Trivy scans the project filesystem for known vulnerabilities and security issues before the Docker image is built.

### 5. 🐳 Docker Build

After the initial validation stages pass, Jenkins builds a Docker image from the application source code.
```bash
docker build -t <image-name>:<tag> .
```
### 6. 🔐 Container Image Scan

Trivy scans the generated Docker image for known vulnerabilities.
```bash
trivy image <image-name>:<tag>
```
The pipeline can be configured to fail when vulnerabilities above a defined severity level are detected.

### 7. 📦 Push Docker Image

After all required CI and security checks pass, Jenkins pushes the Docker image to the configured container registry.
```bash
docker push <registry>/<image-name>:<tag>
```
The image can then be referenced by the Kubernetes deployment.


## 🛠️ Installation & Setup

The following installation steps assume an Ubuntu Linux environment.

#### 1. Git Installation
Git is required for source-code management and for interacting with GitHub repositories.

```bash
sudo apt update
sudo apt install git -y
```

Verify:

```bash
git --version
```

#### 2. Docker Installation
Docker is used to build and package the application into a container image.

Install Docker:

Follow the instructions for linux environment: [Docker Setup](https://docs.docker.com/engine/install/ubuntu/)

Verify:

```bash
docker --version
```
Allow the current user to run Docker without sudo:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

#### 3. Jenkins Installation
Jenkins is used as the Continuous Integration server.

Install Jenkins
Add the Jenkins repository and install Jenkins according to the current Jenkins LTS installation instructions. [Jenkins Installation](https://www.jenkins.io/doc/book/installing/linux/)

After installation:
```bash
sudo systemctl enable jenkins
sudo systemctl start jenkins
```
Check status:

```bash
sudo systemctl status jenkins
```

Jenkins normally runs on:

```bash
http://<SERVER-IP>:8080
```
Retrieve the initial administrator password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
Recommended Jenkins Plugins
Install plugins such as:

- Pipeline Stage View
- Git
- GitHub Integration
- Docker Pipeline
- Credentials Binding
- SonarQube Scanner
- OWASP Dependency-Check


#### 4. SonarQube Installation

SonarQube is used for static code analysis and code quality checks.

For a development/lab environment, SonarQube can be run using Docker.

Create persistent volumes:

```bash
docker volume create sonarqube_data
docker volume create sonarqube_logs
docker volume create sonarqube_extensions
```
Run SonarQube:

```bash
docker run -d \
  --name sonarqube \
  -p 9000:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_logs:/opt/sonarqube/logs \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  sonarqube:lts-community
```

Check the container:

Access SonarQube:
```bash
http://<SERVER-IP>:9000
```
Default Username: `Admin` and Password: `Admin`.

#### 5. OWASP Dependency-Check Installation
OWASP Dependency-Check is used to identify publicly disclosed vulnerabilities in project dependencies.

There are few common approaches:

Jenkins Plugin
Install the OWASP Dependency-Check Plugin from:

Jenkins

→ Manage Jenkins
→ Plugins
→ Available Plugins
→ OWASP Dependency-Check

Configure the tool under:

Manage Jenkins
→ Tools
→ Dependency-Check


#### 6. Trivy Installation
Trivy is used for security scanning.

It can scan:

→ Filesystems
→ Docker images
→ Container configurations
→ Kubernetes-related resources

Install Trivy on Ubuntu using the official repository method. [Trivy Installation](https://trivy.dev/docs/latest/getting-started/installation/#debianubuntu-official)

After installation:

```bash
trivy --version
```
Test Scan Project Filesystem

From the project directory:
```bash
trivy fs .
```
Test Scan Docker Image

After building the image run:

```bash
trivy image multimediasaver-web:latest
```
For CI, you can configure the pipeline to fail when vulnerabilities above your chosen severity are detected:

```bash
trivy fs --severity HIGH,CRITICAL --exit-code 1 .
```

#### 7. kubectl Installation

kubectl is the Kubernetes command-line tool used to communicate with the cluster.

Install kubectl using the official Kubernetes installation instructions.[kubectl Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-on-linux)

Verify:
```bash
kubectl version --client
```
Configure/access the cluster:
```bash
kubectl get nodes
```

#### 8. Kubernetes Installation

Kubernetes is used as the container orchestration platform.

For a lab environment, Kubernetes can be created using tools such as:

- Minikube
- Kind
- kubeadm
- Managed Kubernetes services
For a production-style environment, use an appropriate Kubernetes distribution or managed Kubernetes service.

Verify Kubernetes access:
```bash
kubectl version --client
```

Check the cluster:
```bash
kubectl get nodes
```
Check running resources:
```bash
kubectl get pods -A
```

#### 9. Argo CD Installation

Argo CD is used for Continuous Deployment and GitOps.

Create the Argo CD namespace:
```bash
kubectl create namespace argocd
```
Install Argo CD:
```bash
kubectl apply -n argocd \
  --server-side \
  --force-conflicts \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
Verify:
```bash
kubectl get pods -n argocd
```

All Argo CD components should eventually reach the Running state.

The official Argo CD getting-started guide uses the argocd namespace and Kubernetes manifests for installation. For production, pin Argo CD to a specific version rather than tracking the stable manifest directly. 

Access Argo CD
For a lab environment, port-forward the Argo CD server:
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
Then access:
```bash
https://<SERVER-IP>:8080
```
#### 🔗 Argo CD GitOps Configuration
Create an Argo CD Application that points to the Git repository containing the Kubernetes manifests.

Example structure:

```bash
GitHub
│
├── application-source
│   ├── Dockerfile
│   ├── application files
│   └── Jenkinsfile
│
└── kubernetes
    ├── app-deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

Argo CD continuously monitors the Kubernetes manifest repository.

In this project, **Ansible Vault can be used to protect sensitive configuration files**, while **HashiCorp Vault provides centralized storage and retrieval of secrets** used by the CI/CD environment.

### 🔐 HashiCorp Vault Installation

For this project, Vault is configured in **development mode using Docker**.

> ⚠️ **Note:** Vault development mode is intended only for development and testing. It runs with an in-memory storage backend, uses a predefined root token, and should **not** be used in production environments.

### 1. Pull the Vault Docker Image

```bash
docker pull hashicorp/vault:latest
```

### 2. Start Vault in Development Mode

Run Vault as a Docker container:

```bash
docker run --cap-add=IPC_LOCK \
  -d \
  --name vault \
  -p 8200:8200 \
  -e VAULT_DEV_ROOT_TOKEN_ID=root \
  hashicorp/vault:latest
```

### 3. Verify the Vault Container

Check that the Vault container is running:

```bash
docker ps
```

You should see the Vault container running on port `8200`.

Check the container logs:

```bash
docker logs vault
```

### 4. Access Vault UI

Vault's web UI is available at:

```text
http://<SERVER-IP>:8200
```

For local development:

```text
http://localhost:8200
```

Use the development `root` token configured when starting the container

> ⚠️ The `root` token shown above is only suitable for a local development environment. Never use a development root token in a production deployment.

### 5. Authenticate with Vault

For the development environment:

```bash
vault login root
```

Enter the development root token when prompted.

### 6. Store Secrets in Vault

Enable the KV secrets engine if required:

```bash
vault secrets enable -path=secret <desirable token>-v2
```

Store an example Docker registry credential:

```bash
vault <Chosen token> put secret/docker \
  username="<DOCKER_USERNAME>" \
  password="<DOCKER_PASSWORD>"
```

### 8. Retrieve Secrets

To read the stored secret:

```bash
vault kv get secret/<token>
```

You can also retrieve a specific field:

```bash
vault kv get -field=username secret/<token>
```






