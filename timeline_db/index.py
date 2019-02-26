# -*- coding: utf-8 -*-
import pymysql
import sys
import copy
reload(sys)
sys.setdefaultencoding('utf-8')

arrHistory = []
arrImage = []

def mysql_connect(dbname='miniapp_migrate_origin'):
	return pymysql.connect(host='localhost', user='root', password='noXf09hmGhnOFsZ!', db=dbname, charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)

def get_new_data(arr_child, father_id, box_father):
    flag = 0
    tmp = {}
    for childItem in arr_child:
        item_data = recover(childItem)
        if int(item_data['fatherId']) == int(father_id):
            flag = 1
            tmp = item_data

    if flag == 1:
        tmp['boxFather'] = box_father
        arrHistory.append(tmp)
        result = get_new_data(arr_child, tmp['rowId'], box_father)
        if result['status'] == 1:
            tmp = result['data']
        return {
            'status': 1,
            'data': tmp
        }
    else:
        return {
            'status': 0,
            'data': {}
        }


def recover(item):
    return {
        'rowId': item[0],
        'userId': item[15],
        'openid': item[1],
        'imgStr': item[2],
        'eventName': item[3],
        'eventTime': item[4],
        'isDel': item[5],
        'created_at': item[7],
        'updated_at': item[8],
        'eventContent': item[9],
        'eventType': item[11],
        'fatherId': item[12],
        'address': item[13],
        'isDefault': item[14]
    }


db = MySQLdb.connect('localhost', 'root', 'root', 'timeline_test', charset='utf8', init_command='SET NAMES UTF8')
db_origin = MySQLdb.connect('localhost', 'root', 'root', 'timeline', charset='utf8', init_command='SET NAMES UTF8')
db.set_character_set('utf8')
db_origin.set_character_set('utf8')
cursor_origin = db_origin.cursor()

cursorFather = db.cursor()
cursorFather.execute("select *,b.id from box as a,users as b where father = 0 and a.openid = b.openid")
dataFather = cursorFather.fetchall()
cursorChild = db.cursor()
cursorChild.execute("select *,b.id from box as a,users as b where father != 0 and a.openid = b.openid")
dataChild = cursorChild.fetchall()
arr = []
for row in dataFather:
    rowRecover = recover(row)
    rowRecover['boxFather'] = 0
    item = rowRecover
    childRes = get_new_data(dataChild, rowRecover['rowId'], rowRecover['rowId'])

    if childRes['status'] == 1:
        result_re = copy.deepcopy(childRes['data'])
        result_re['rowId'] = rowRecover['rowId']
        item = result_re
    arrHistory.append(rowRecover)
    arr.append(item)

result_arr = []
for row in arr:
    item = (
       row['rowId'],
       row['userId'],
       row['eventName'],
       row['eventContent'],
       row['eventTime'],
       row['address'],
       row['isDel'],
       row['eventType'],
       row['isDefault'],
       row['created_at'],
       row['updated_at'],
    )
    result_arr.append(item)
result_history = []
for row in arrHistory:
    result_history.append((
        row['rowId'],
        row['userId'],
        row['boxFather'],
        row['eventName'],
        row['eventContent'],
        row['eventTime'],
        row['address'],
        row['isDel'],
        row['eventType'],
        row['isDefault'],
        row['created_at'],
        row['updated_at'],
    ))
    
sql_box = '''
    insert into base_box(id, user_id, eventName, eventContent,
     eventTime, address, idDel, eventType, isDefault, created_at, updated_at)
     values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
'''
sql_box_history = '''
    insert into base_box_history(id, user_id,box_id, eventName, eventContent,
     eventTime, address, idDel, eventType, isDefault, created_at, updated_at)
     values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
'''
cursor_origin.executemany(sql_box, result_arr)
cursor_origin.executemany(sql_box_history, result_history)
db_origin.commit()
print len(arr), len(arrHistory), len(dataChild)
db.close()
db_origin.close()
