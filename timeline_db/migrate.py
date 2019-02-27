# -*- coding: utf-8 -*-
import pymysql
import time
import hashlib
import random
import re

arrHistory = []
arrImage = []


def mysql_connect(dbname='miniapp_migrate_origin'):
    return pymysql.connect(host='localhost', user='root', password='noXf09hmGhnOFsZ!', db=dbname, charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)


def msgShow(msg):
    print(msg)


def getOriginDate(sql):
    connection = mysql_connect()
    try:
        with connection.cursor() as cursor:
            # Read a single record
            cursor.execute(sql)
            result = cursor.fetchall()
            return result
    finally:
        connection.close()


def migareUserData():
    userArr = getOriginDate("SELECT * FROM `users` where isWeixin != 0")
    newUserArr = []
    userIdArr = {}
    for item in userArr:
        userIdArr[item['openid']] = item['id']
        waitMd5 = 'benbentime'+item['openid'] + \
            str(random.randrange(10000, 99999))
        hash_md5 = hashlib.md5(waitMd5.encode('utf-8'))
        token = hash_md5.hexdigest()
        newUserArr.append((
            item['id'],
            item['openid'],
            token,
            item['username'],
            item['password'],
            '',
            item['user_pic'],
            item['sex'],
            item['province'],
            item['city'],
            item['isWeixin'],
            item['created_at'],
            item['updated_at']
        ))
    try:
        connection = mysql_connect('miniapp_migrate_new')
        with connection.cursor() as cursor:
            # Create a new record
            sql = '''
			INSERT INTO `base_users` (`id`, `openid`, `token`, `username`, `password`, `secure_password`, `user_pic`, `sex`, `province`,`city`, `isWeixin`,`created_at`, `updated_at`)
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
            cursor.executemany(sql, newUserArr)
        connection.commit()
    finally:
        connection.close()
    return userIdArr


def insertBox(boxNewArr):
    try:
        connection = mysql_connect('miniapp_migrate_new')
        with connection.cursor() as cursor:
            # Create a new record
            sql = '''
			INSERT INTO `base_box` (`id`, `user_id`, `eventName`, `eventContent`, `eventTime`, `address`, `idDel`, `eventType`, `isDefault`,`created_at`, `updated_at`)
			VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) '''
            print(sql)
            cursor.executemany(sql, boxNewArr)
        connection.commit()
    finally:
        connection.close()


def insertBoxHistory(boxNewArr):
    try:
        connection = mysql_connect('miniapp_migrate_new')
        with connection.cursor() as cursor:
            # Create a new record
            sql = '''
			INSERT INTO `base_box_history` (`id`, `user_id`, `box_id`,`eventName`, `eventContent`, `eventTime`, `address`,`created_at`, `updated_at`)
			VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s) '''
            print(sql)
            cursor.executemany(sql, boxNewArr)
        connection.commit()
    finally:
        connection.close()


def insertImage(imgArr):
    try:
        connection = mysql_connect('miniapp_migrate_new')
        with connection.cursor() as cursor:
            # Create a new record
            sql = '''
			INSERT INTO `base_image` ( `user_id`, `box_id`,`url`, `hash`, `isDel`,`created_at`, `updated_at`)
			VALUES(%s, %s, %s, %s, %s, %s, %s) '''
            print(sql)
            cursor.executemany(sql, imgArr)
        connection.commit()
    finally:
        connection.close()


def getBoxLast(arr_child, father_id, box_father):
    flag = 0
    tmp = {}
    for childItem in arr_child:
        item_data = childItem
        if int(item_data['father']) == int(father_id):
            flag = 1
            tmp = item_data

    if flag == 1:
        arrHistory.append((
            tmp['id'],
            tmp['user_id'],
            box_father,
            tmp['eventName'],
            tmp['eventContent'],
            tmp['eventTime'],
            tmp['address'],
            tmp['created_at'],
            tmp['updated_at']
        ))
        boxNewImgArr = splitImg(tmp['img'])
        for imgItem in boxNewImgArr:
            arrImage.append((
                tmp['user_id'],
                tmp['id'],
                imgItem,
                '',
                tmp['idDel'],
                tmp['created_at'],
                tmp['updated_at']
            ))
        result = getBoxLast(arr_child, tmp['id'], box_father)
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


def splitImg(str):
    resultArr = []
    if str:
        strArr = re.split(r"-", str);
        for item in strArr:
            result = re.findall(r'http:\/\/7xlabr.com1.z0.glb.clouddn.com\/(.+)', item)
            if len(result) > 0:
                resultArr.append(result[0])
            else:
                resultArr.append(item)
        return resultArr
    else:
        return resultArr

def migarateBoxData():
    boxArrFather = getOriginDate(
        "select b.*,u.id as user_id from box as b,users as u where b.openid = u.openid and u.isWeixin != 0 and b.father = 0")
    boxArrChild = getOriginDate(
        "select b.*,u.id as user_id from box as b,users as u where b.openid = u.openid and u.isWeixin != 0 and b.father != 0")
    boxNewArr = []
    for oldItem in boxArrFather:
        newItem = getBoxLast(boxArrChild, oldItem['id'], oldItem['id'])
        if (newItem['status'] == 0):
            item = oldItem
        else:
            item = newItem['data']
        boxNewArr.append((
            item['id'],
            item['user_id'],
            item['eventName'],
            item['eventContent'],
            item['eventTime'],
            item['address'],
            item['idDel'],
            item['eventType'],
            item['isDefault'],
            item['created_at'],
            item['updated_at']
        ))
        boxNewImgArr = splitImg(item['img']);
        for imgItem in boxNewImgArr:
            arrImage.append((
                item['user_id'],
                item['id'],
                imgItem,
                '',
                item['idDel'],
                item['created_at'],
                item['updated_at']
            ))

    print("插入数据库 box")
    insertBox(boxNewArr)
    print("插入数据库 history box")
    insertBoxHistory(arrHistory)
    print("插入数据库 image")
    print(arrImage)
    insertImage(arrImage)
    print("结束")


def init():
    # migareUserData()
    migarateBoxData()
    pass


if __name__ == "__main__":
    msgShow('start:' + time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
    init()
    msgShow('end:' + time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
   
