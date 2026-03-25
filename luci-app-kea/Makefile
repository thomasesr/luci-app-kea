include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-kea
PKG_VERSION:=0.1.1
PKG_RELEASE:=3
PKGARCH:=all

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Thomas Richter <thomasesr@gmail.com>
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-kea
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=Kea Application for LuCI network interface editor
  DEPENDS:=+luci-base +rpcd +rpcd-mod-ucode +kea-hook-lease-cmds +kea-uci +kea-ctrl +kea-dhcp4
endef

define Package/luci-app-kea/description
 Adds Kea-aware DHCP tab behavior to LuCI interface editor.
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
endef

define Build/Compile
endef

define Package/luci-app-kea/install
	$(CP) ./root/* $(1)/
endef

$(eval $(call BuildPackage,luci-app-kea))

