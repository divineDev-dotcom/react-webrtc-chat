pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
        // Add your environment variables here if needed, or load from .env
    }

    tools {
        nodejs 'NodeJS 18' // You must configure this in Jenkins global tools
    }

    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: 'github-token' , url: 'https://github.com/your-username/your-repo.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node modules...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh 'npm test -- --watchAll=false' // CRA default test command
            }
        }

        stage('Build App') {
            steps {
                echo 'Building React App...'
                sh 'npm run build'
            }
        }

        stage('Archive Build Artifacts') {
            steps {
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }

        // Optional: stage('Deploy') { ... }
    }

    post {
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed.'
        }
    }
}
