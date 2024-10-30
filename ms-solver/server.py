import os
import json
import time
import datetime
import subprocess
from math import radians, sin, cos, sqrt, atan2
from confluent_kafka import Consumer, Producer
import random
import string

print('Service solver enter.')

def run_submission(script_content, input_content):

    # if input is string, turn it to json object
    if isinstance(input_content, str):
        input_content = json.loads(input_content)

    input_file_path = './input_data.json'
    script_path = './temp_script.py'

    # Write the script content to a temporary file
    with open(script_path, 'w') as file:
        file.write(script_content)

    # Write the input content to a temporary file
    with open(input_file_path, 'w') as input_file:
        json.dump(input_content, input_file)

    # Execute the Python script and measure the execution time
    start_time = time.time()
    MAX_EXEC_SECS = 400;

    try:
        result = subprocess.run(['python3', script_path, input_file_path], capture_output=True, text=True, timeout=MAX_EXEC_SECS)
        output = result.stdout
        error = result.stderr
    except subprocess.TimeoutExpired:
        output = ''
        error = 'Script execution timed out.'

    end_time = time.time()
    running_time = (end_time - start_time) # in seconds

    # Clean up: remove the temporary script file and input file
    subprocess.run(['rm', script_path])
    subprocess.run(['rm', input_file_path])

    return {
        'output': output,
        'error': error,
        'running_time': running_time
    }

def kafka_consumer():
    # Setup Kafka consumer
    print('Service solver consumer enter.')

    consumer = Consumer({
        'bootstrap.servers': 'kafka-broker:9092',
        'group.id': 'ms-solver',
        'client.id': 'ms-solver',
        'auto.offset.reset': 'earliest'
        })
    # Setup Kafka Producer
    producer = Producer({
    'bootstrap.servers': 'kafka-broker:9092',
    'client.id': 'ms-solver',
    'client.id': 'ms-solver',
    })

    consumer.subscribe(['solver-req'])
    print('Service solver is running.')
    while True:

        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue

        if (msg.topic() == 'solver-req'):

            print('Solver received message.')
            data = msg.value().decode('utf-8')
            data_dict = json.loads(data)

            # inform that execution is starting
            if data_dict is not None:
                produce_output(producer, 'execution-started', {'email': data_dict['email'], 'submission_id': data_dict['submission_id']})
            else:
                print("Received data is None")


            result = run_submission(data_dict['users_code'], data_dict['users_input'])

            now = datetime.datetime.now(datetime.timezone.utc).isoformat()

            data_to_sent = {}
            data_to_sent["email"] = data_dict['email']
            data_to_sent["submission_id"] = data_dict["submission_id"]

            data_to_sent['execution_output'] = result['output']
            data_to_sent['error'] = result['error']
            data_to_sent['execution_duration'] = result['running_time']
            data_to_sent['execution_date'] = now
            produce_output(producer, 'output-res', data_to_sent)

def produce_output(producer, topic, data):
    producer.produce(topic, value=json.dumps(data))
    producer.poll(200)
    # producer.flush()
    print(f'message to {topic} published!')

if __name__ == '__main__':
    kafka_consumer()
