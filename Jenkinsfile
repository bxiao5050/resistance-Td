node () {
    def workspace = pwd()
    def url = "http://172.16.3.205:10000/sender/wechat?"
    def tos = "kk,tao.wang"
    def content = "PROJECT: ${PROJECT_NAME}&BUILD: ${BUILD_NUMBER}&Status: ${BUILD_STATUS}&URL: http://jenkins.royale.com/blue/organizations/jenkins/${PROJECT_NAME}/detail/${PROJECT_NAME}/${BUILD_NUMBER}/pipeline/"

    stage ('checkout') {
        git branch: 'master', credentialsId: '99130ab1-7e3b-4305-8748-a342c064d9a8', url: 'http://gitsrv01.royale.com/front-end/system-oversea-new.git'
    }

    stage ('install') {
        try {
            sh 'npm install'
        } catch(err) {
            sh 'echo "npm install error"'
            def content="npm install error&"$content
            sh "curl -d \"tos=$tos&content=$(echo $content | xargs -d\'&\' -n 1 | sed \'$d\')\" $url"
            throw err
            sh 'exit 1'
        }
    }
    stage ('build') {
        try {
            sh '''
                rm -rf dist
                npm run build
            '''
        } catch(err) {
            sh 'echo "npm run build error"'
            def content="npm build error&"$content
            sh "curl -d \"tos=$tos&content=$(echo $content | xargs -d\'&\' -n 1 | sed \'$d\')\" $url"   
            throw err
            sh 'exit 1'
        }
    }
    stage ('package') {
        try {
            sh '''
                filename=oas-$(date '+%Y%m%d%H%M%S').zip
                cd dist && zip -qr ${filename} *
                cd ..
            '''
        } catch(err) {
            sh 'echo "package error"'
            def content="package error&"$content
            sh "curl -d \"tos=$tos&content=$(echo $content | xargs -d\'&\' -n 1 | sed \'$d\')\" $url"       
            throw err
            sh 'exit 1'
        }
    }
    stage ('update') {
        try {
            sh '''
                src_file=$(ls -rht dist/oas-*.zip | head -n 1)
                dest_file=/data/server_new/${src_file#dist/}
                dt=$(date '+%Y%m%d%H%M%S')
                ansible-playbook -i ansible/hosts ansible/deploy.yml -v --extra-var "src_file=$(pwd)/${src_file} dest_file=${dest_file} arch_file=oas-${dt}.zip project=oas"
                def content="success&"$content
                sh "curl -d \"tos=$tos&content=$(echo $content | xargs -d\'&\' -n 1 | sed \'$d\')\" $url"            
            '''
        } catch(err) {
            sh 'echo "update error"'
            def content="update error&"$content
            sh "curl -d \"tos=$tos&content=$(echo $content | xargs -d\'&\' -n 1 | sed \'$d\')\" $url"             
            throw err
            sh 'exit 1'
        }
    }
}