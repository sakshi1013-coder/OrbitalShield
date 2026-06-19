pipeline {
    agent any

    environment {
        // macOS standard paths for Homebrew, Docker Desktop, and system binaries
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:${env.PATH}"
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out code from repository SCM...'
                checkout scm
            }
        }

        stage('Display Git Commit Information') {
            steps {
                echo 'Retrieving latest Git commit details:'
                sh 'git log -1 --stat'
            }
        }

        stage('Verify Docker Installation') {
            steps {
                echo 'Checking Docker installation status...'
                sh 'docker --version'
            }
        }

        stage('Verify Docker Compose Installation') {
            steps {
                echo 'Checking Docker Compose installation status...'
                sh 'docker compose version || docker-compose --version'
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any running OrbitalShield containers...'
                sh 'docker compose -f docker-compose.yml down --remove-orphans || true'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building fresh Docker images using docker-compose.yml...'
                sh 'docker compose -f docker-compose.yml build'
            }
        }

        stage('Start Application') {
            steps {
                echo 'Starting OrbitalShield application containers in detached mode...'
                sh 'docker compose -f docker-compose.yml up -d'
            }
        }

        stage('Verify Containers Running') {
            steps {
                echo 'Verifying that all containers started successfully...'
                sh '''
                # Sleep a few seconds to let database and servers start initialization
                sleep 5
                
                containers=("orbitalshield-db" "orbitalshield-backend" "orbitalshield-frontend")
                for container in "${containers[@]}"; do
                    status=$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null || echo "false")
                    if [ "$status" != "true" ]; then
                        echo "FATAL ERROR: Container '$container' is not running!"
                        docker logs "$container" | tail -n 30
                        exit 1
                    else
                        echo "Container '$container' is running nominal."
                    fi
                done
                '''
            }
        }

        stage('Print Running Containers') {
            steps {
                echo 'Displaying final active container status:'
                sh 'docker ps --filter "name=orbitalshield"'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully. Cleaning workspace...'
            cleanWs()
        }
        failure {
            echo 'Pipeline build failed! Inspect the console logs above.'
        }
    }
}
