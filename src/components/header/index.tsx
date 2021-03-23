import React, { useEffect, useState, useMemo } from 'react'
import './style.scss'
import Avatar from '@/components/avatar'
import moment from 'moment'
import config from '@/config'
import { Layout, Badge, Popover, Empty } from 'antd'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { HomeMainState } from '@/views/home/main/index'
import { connect } from 'react-redux'
import { StoreState } from '@/store'
import { logout } from '@/store/actions/user'
import { SETTING } from '@/router/constants'
import { serviceGetInnerMessage } from '@/services'
import { fullscreen, exitFullscreen } from '@/utils'
import {
  PoweroffOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellFilled,
  BugFilled,
  GithubOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons'

const { Header } = Layout
const popoverList = [
  { name: SETTING.BASE.name, path: SETTING.BASE.path },
  { name: SETTING.NOTIFICATION.name, path: SETTING.NOTIFICATION.path },
  { name: SETTING.ACCOUNT.name, path: SETTING.ACCOUNT.path }
]

type Props = ReturnType<typeof mapStateToProps> & HomeMainState & RouteComponentProps

const PopoverContent = (
  <div className="popover-content">
  {popoverList.map(el => (
    <Link to={el.path} key={el.name} className="ls">{el.name}</Link>
  ))}
    <div className="ls sign-out" onClick={() => logout()}>
      <PoweroffOutlined style={{ fontSize: '14px', marginRight: '5px' }} />
      退出
    </div>
  </div>
)

const HomeHeader: React.FC<Props> = function ({
  collapsed,
  setCollapsed,
  userInfo
}) {
  const [messageList, setMessageList] = useState([])
  const [unReadCount, setUnReadCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    serviceGetInnerMessage({ pageSize: 5 })
    .then(res => {
      if (res.data.success) {
        let count = 0
        const data = res.data.data.rows.map((item: any) => {
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm')
          if (!item.hasRead) {
            count++
          }
          return item
        })
        setUnReadCount(count)
        setMessageList(data)
      }
    })
  }, [])

  const MessageContent = useMemo(() => (
    <div className="message-popover">
      <div className="msg-header item-block">
        <span className="left">站内消息通知</span>
        <Link className="right" to={SETTING.NOTIFICATION.path}>消息接收管理</Link>
      </div>
      {messageList.length > 0 ? (
        <>
          {messageList.map((item: any) => (
          <div className="item-block ls" key={item.id}>
            <div className="content">{item.content}</div>
            <div className="date">{item.createdAt}</div>
          </div>
        ))}
        <Link className="item-block ls" to={SETTING.INNER_MESSAGE.path}>查看更多</Link>
        </>
      ) : (
        <Empty style={{ padding: '20px 0' }} />
      )}
    </div>
  ), [messageList])

  function handleFullscreen() {
    setIsFullscreen(isFullscreen => {
      isFullscreen ? exitFullscreen() : fullscreen()
      return !isFullscreen
    })
  }

  return (
    <Header>
      <div className="left">
        {collapsed ? (
          <MenuUnfoldOutlined
            onClick={setCollapsed}
            style={{ cursor: 'pointer', fontSize: '20px' }}
          />
        ) : (
          <MenuFoldOutlined
            onClick={setCollapsed}
            style={{ cursor: 'pointer', fontSize: '20px' }}
          />
        )}
      </div>
      <ul className="right">
        <Popover content={MessageContent}>
          <li>
            <Badge dot={unReadCount > 0}>
              <BellFilled />
            </Badge>
          </li>
        </Popover>
        <li onClick={handleFullscreen}>
          {isFullscreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
        </li>
        <li>
          <a href={config.github.bug} target="_blank" rel="noopener noreferrer">
            <BugFilled />
          </a>
        </li>
        <li>
          <a href={config.github.repositoryUrl} target="_blank" rel="noopener noreferrer">
            <GithubOutlined />
          </a>
        </li>
        <Popover
          placement="bottomRight"
          content={PopoverContent}
        >
        <li>
          <Avatar src={userInfo.avatarUrl} />
          <span className="username">{userInfo.username}</span>
        </li>
        </Popover>
      </ul>
    </Header>
  )
}

const mapStateToProps = ({ user }: StoreState) => {
  return { userInfo: user.userInfo }
}

export default connect(mapStateToProps)(withRouter(HomeHeader))
