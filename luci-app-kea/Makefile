include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-kea
PKG_VERSION:=1
PKG_RELEASE:=1

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Thomas Richter <thomasesr@gmail.com>

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-kea
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for Kea DHCP
  DEPENDS:=+luci-base +rpcd +kea-uci +kea-dhcp4 +kea-ctrl +kea-hook-lease-cmds
endef

define Package/luci-app-kea/description
 LuCI interface for managing Kea DHCPv4 on OpenWrt.
endef

define Build/Compile
endef

define Package/luci-app-kea/install
	$(CP) ./luci-app-kea/root/* $(1)/
endef

$(eval $(call BuildPackage,luci-app-kea))
