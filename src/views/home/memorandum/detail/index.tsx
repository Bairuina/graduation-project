import React, { FC, useEffect, useState } from 'react'
import './style.scss'
import { match, Link, RouteComponentProps } from 'react-router-dom'
import { serviceGetMemorandumById } from '@/services'
import { defaultTitle } from '../constants'
import { LeftOutlined, EditOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

interface Props {
  computedMatch: match<any>
}

const DetailPage: FC<Props & RouteComponentProps> = ({ computedMatch, history }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const id = computedMatch.params.id

  useEffect(() => {
    serviceGetMemorandumById(id)
    .then(res => {
      if (res.data.success) {
        const title = res.data.data.title || defaultTitle
        document.title = title
        setTitle(title)
        setContent(res.data.data.html)
      }
    })
    .finally(() => setLoading(false))
  }, [id])

  return (
    <Spin spinning={loading}>
      <div className="memorandum-detail">
        <div className="tool-bar">
          <LeftOutlined className="icon-left" onClick={history.goBack} />
          <Link className="edit" to={`/home/memorandum/update/${id}`}>
            <EditOutlined title="编辑" />
          </Link>
        </div>
        <h1 className="title">{ title }</h1>
        <div
          className="markdown-body tui-editor-contents"
          dangerouslySetInnerHTML={{ __html: content }}
        >
        </div>
      </div>
    </Spin>
  )
}

export default DetailPage
