node () {
    def workspace = pwd()

    stage ('checkout') {
        git branch: 'master', credentialsId: '99130ab1-7e3b-4305-8748-a342c064d9a8', url: 'http://gitsrv01.royale.com/front-end/system-oversea-new.git'
    }

    stage ('install') {
        try {
            sh 'npm install'
        } catch(err) {
            sh 'echo "npm install error"'
            throw err
            sh 'exit 1'
        }
    }
    stage ('build') {
        try {
            sh 'npm run build'
        } catch(err) {
            sh 'echo "npm run build error"'
            throw err
            sh 'exit 1'
        }
    }
}