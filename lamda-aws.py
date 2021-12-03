import json
import string

def lambda_handler(event, context):

    import codecs
    import boto3
    from boto3 import Session
    from boto3 import resource
    
    session = Session(region_name="us-east-1")
    polly = session.client("polly")
    client = boto3.client('dynamodb')
    message = event['Records'][0]['Sns']['Message']
    idTrain = int(message)
    
    
    print(message)
    
    
    s3 = resource('s3')
    bucket_name = "audiofilespolly"
    bucket = s3.Bucket(bucket_name)
    
    data = client.scan(
        TableName = "stations"
        )
    
    nameAudioString = "estacao"+ str(idTrain) + ".mp3"
    print(nameAudioString)
    
    filename = nameAudioString
    response = {
        'statusCode':200,
        'body': json.dumps(data),
        'headers':{
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
        },
    }

    currentStation = " "   
    c = json.loads(response['body'])
    for i in range(len(c["Items"])):
        if (int(c["Items"][i]["id"]["S"]) == idTrain):
            currentStation = c["Items"][i]["name"]["S"]
            break
    print(currentStation)
                            
    response = polly.synthesize_speech(
    Text=currentStation,
    OutputFormat="mp3",
    VoiceId="Camila")
    stream = response["AudioStream"]
                                
    bucket.put_object(Key=filename, Body=stream.read())